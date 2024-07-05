import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Text } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = ['Picture From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      },
    );
  }

  const uploadAndSendImage = async (imageURI) => {
    const response = await fetch(imageURI);
    const blob = await response.blob();
    const newUploadRef = ref(storage, generateReference(imageURI));
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      console.log('File has been uploaded successfully.');
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    }).catch((err) => {
      console.log(err);
    });
  }

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {
        uploadAndSendImage(result.assets[0].uri);
      } else setImage(null);
    }
  }

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        uploadAndSendImage(result.assets[0].uri);
      } else setImage(null);
    }
  }

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          }
        });
      } else Alert.alert('Error occurred while fetching location.');
    } else Alert.alert('Permissions have not been granted.');
  }

  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${timeStamp}-${imageName}`;
  }

  return (
    <TouchableOpacity style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="share image or location">
      <View style={[wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>
          <Icon name="paperclip" size={20} ></Icon>
        </Text>
      </View>
    </TouchableOpacity>
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
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 15,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;