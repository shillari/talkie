import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, activeColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: activeColor }]}>
      <Text>Chat</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFDAC7"
  }
});

export default Chat;