import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Bubble, Day, GiftedChat, SystemMessage } from "react-native-gifted-chat";

// Chat UI
const Chat = ({ route, navigation }) => {
  const { name, activeColor, contact } = route.params;
  const [messages, setMessages] = useState([]);

  // Stack new messages
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  useEffect(() => {
    // Change the header name to be the contact name
    navigation.setOptions({ title: contact.name });

    // Mock messages
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
        },
      },
      //This is a system message
      {
        _id: contact.id,
        text: `You've entered the chat`,
        createdAt: new Date(),
        system: true,
      }
    ]);
  }, []);

  // Change the default bubble style
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: [styles.bubble, { backgroundColor: '#F09F77' }],
        left: [styles.bubble, { backgroundColor: "#FFEFE6", }]
      }}
    />
  }

  // Change the default system message style
  const renderSystemMessage = (props) => {
    return <SystemMessage
      {...props}
      textStyle={{
        fontWeight: "bold",
        backgroundColor: "#FFEFE6",
        paddingHorizontal: 5,
        borderRadius: 5
      }}
    />
  }

  // Change the default day style
  const renderDay = (props) => {
    return <Day
      {...props}
      textStyle={{
        fontWeight: "bold",
        backgroundColor: "#FFEFE6",
        paddingHorizontal: 5,
        borderRadius: 5
      }}
    />
  }

  return (
    <View style={[styles.container, { backgroundColor: activeColor }]}>
      {/* Library responsible to create a chat UI */}
      <GiftedChat
        styles={[styles.container, { backgroundColor: activeColor }]}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1
        }}
        renderBubble={renderBubble}
        renderUsernameOnMessage={true}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
      />
      {/* Android older versions have a bug that does not show text message.
      This config fixes it. */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDAC7"
  },
  bubble: {
    borderWidth: 0.5,
  },
  systemMessage: {
    fontWeight: "bold",
    backgroundColor: "#FFEFE6",
    paddingHorizontal: 3,
    borderRadius: 5
  }
});

export default Chat;