import { useState } from "react";
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import bg_img from '../assets/chat_background.jpg';
import logo from '../assets/talkie-logo.png';

// Main view 
const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [activeColor, setActiveColor] = useState('#FFDAC7');

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate('Contacts',
          {
            userID: result.user.uid,
            name: name,
            activeColor: activeColor
          });
      })
      .catch((error) => {
        Alert.alert('Unable to sign in, please try again later.');
      });
  }

  // Check if the user input is empty
  const handleButtonPress = () => {
    if (name.length < 3) {
      Alert.alert('Enter a valid name');
    } else {
      signInUser();
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={bg_img}
        resizeMode="cover"
        style={styles.image}>
        <Image style={styles.logo}
          source={logo} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={setName}
            value={name}
            placeholder="Enter your name"
          />
          <Text>Choose background color:</Text>
          {/* View containing buttons with background's colors */}
          <View style={styles.buttonColors}>
            <TouchableOpacity style={[styles.buttonColor,
            styles.buttonColorOne,
            activeColor === '#FFDAC7' && styles.activeButtonColor]}
              onPress={() => setActiveColor('#FFDAC7')}>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonColor,
            styles.buttonColorTwo,
            activeColor === '#A6C9D9' && styles.activeButtonColor]}
              onPress={() => setActiveColor('#A6C9D9')}>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonColor,
            styles.buttonColorThree,
            activeColor === '#DED8CF' && styles.activeButtonColor]}
              onPress={() => setActiveColor('#DED8CF')}>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonColor,
            styles.buttonColorFour,
            activeColor === '#A5DEA4' && styles.activeButtonColor]}
              onPress={() => setActiveColor('#A5DEA4')}>
            </TouchableOpacity>
          </View>
          {/* Button that navigates to chat screen when pressed */}
          <TouchableOpacity style={styles.button}
            onPress={() => handleButtonPress()}>
            <Text>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    flex: 1,
    width: "100%",
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  logo: {
    position: 'absolute',
    top: 100,
    width: 150,
    height: 35,
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#FFEFE6",
  },
  button: {
    width: "88%",
    alignItems: 'center',
    backgroundColor: '#F09F77',
    padding: 10,
  },
  buttonColors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginBottom: 10
  },
  buttonColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 0.5,
  },
  buttonColorOne: {
    backgroundColor: '#FFDAC7',
  },
  buttonColorTwo: {
    backgroundColor: '#A6C9D9',
  },
  buttonColorThree: {
    backgroundColor: '#DED8CF',
  },
  buttonColorFour: {
    backgroundColor: '#A5DEA4',
  },
  activeButtonColor: {
    borderWidth: 5,
    borderColor: '#4F4F4F'
  },
  inputContainer: {
    width: "90%",
    backgroundColor: '#ffdac7ce',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    marginBottom: '45%'
  }
});

export default Start;