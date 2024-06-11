import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

// The app’s main Chat component that renders the chat UI
const App = () => {

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        // screenOptions={{ headerShown: false }}
        initialRouteName='Start'>
        <Stack.Screen
          name='Start'
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Chat'
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;