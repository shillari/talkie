import { Alert, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';
//import ContactList from './components/ContactList';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import ContactList from './components/ContactList';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAq3YpgVpfxq7ek7ODh9fFQuuDvLbuxYnE",
  authDomain: "talkie-ca914.firebaseapp.com",
  projectId: "talkie-ca914",
  storageBucket: "talkie-ca914.appspot.com",
  messagingSenderId: "380674289131",
  appId: "1:380674289131:web:e0c0b36a14794cb6d9fdae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// The app’s main Chat component that renders the chat UI
const App = () => {

  useEffect(() => {
    LogBox.ignoreLogs(['Support for defaultProps will be removed from function components']);
    LogBox.ignoreAllLogs();
  }, []);

  const Stack = createNativeStackNavigator();

  // Checks the network connectivity status
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        // screenOptions={{ headerShown: false }}
        initialRouteName={'Start'}>
        <Stack.Screen
          name='Start'
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Chat'
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name='Contacts'
          component={ContactList}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;