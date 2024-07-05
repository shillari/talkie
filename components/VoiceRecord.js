import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Audio } from "expo-av";

const VoiceRecord = ({ wrapperStyle, iconTextStyle, onSend, storage, isRecording }) => {
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    return () => {
      if (recording) recording.stopAndUnloadAsync();
    }
  }, []);

  const startRecording = async () => {
    try {
      let permissions = await Audio.requestPermissionsAsync();

      if (permissions?.granted) {
        console.log('Starting recording..');
        // iOS specific config to allow recording on iPhone devices
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
          .then(results => {
            return results.recording;
          }).then(recording => {
            setRecording(recording);
            isRecording(true);
          });
      }
    } catch (err) {
      Alert.alert('Failed to record!');
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');

    if (recording) {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false
      });
      await recording.stopAndUnloadAsync();
      setRecording(null);
      isRecording(false);
    }
  };

  const sendRecord = async () => {
    console.log('Stopping recording..');

    if (recording) {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false
      });
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      const newUploadRef = ref(storage, getAudioName(uri));
      const response = await fetch(uri);
      const blob = await response.blob();
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        const soundURL = await getDownloadURL(snapshot.ref)
        onSend({ audio: soundURL })
      });
      setRecording(null);
      isRecording(false);
    }
  }

  const getAudioName = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${timeStamp}-${imageName}`;
  }

  return (
    <View style={[styles.wrapper, recording && styles.recordingStyle]}>
      <TouchableOpacity style={styles.container}
        onPress={recording ? sendRecord : startRecording}
        accessible={true}
        accessibilityLabel="record audio">
        <View style={[wrapperStyle]}>
          <Text style={[styles.iconText, iconTextStyle]}>
            {recording ? <Icon2 name="stop-circle"
              size={20} color='#CC0000'></Icon2>
              : <Icon name="microphone" size={20} ></Icon>}
          </Text>
        </View>
      </TouchableOpacity>
      {recording ? <TouchableOpacity
        style={styles.cancelButton}
        onPress={stopRecording}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 7,
    marginBottom: 7,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 15,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  recordingStyle: {
    width: '100%'
  },
  cancelText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelButton: {
    marginLeft: 15,
    marginBottom: 10,
    textAlign: 'center',
    alignItems: 'center',
  },
});

export default VoiceRecord;