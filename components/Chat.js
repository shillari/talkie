import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Bubble, Day, GiftedChat, InputToolbar, SystemMessage } from "react-native-gifted-chat";

// Chat UI
const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, activeColor, userID, contact } = route.params;
  const [messages, setMessages] = useState([]);
  const collectionContact = contact.name.trim();
  const [loading, setLoading] = useState(true);

  // Stack new messages
  const onSend = async (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    // add the new message to firebase
    await addDoc(collection(db, collectionContact), {
      ...newMessages[0],
      createdAt: new Date()
    });
  }

  let unsubMessages;
  useEffect(() => {
    setLoading(true);
    // Change the header name to be the name
    navigation.setOptions({ title: contact.name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // query the wanted collection from firebase
      const q = query(collection(db, collectionContact), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (messagesSnapshot) => {
        let newMessages = [];
        messagesSnapshot.forEach(msg => {
          newMessages.push(
            {
              id: msg.id,
              ...msg.data(),
              createdAt: new Date(msg.data().createdAt.toMillis()),
            })
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
        setLoading(false);
      });
    } else loadMessages();

    // stops receiving updates from firebase
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  const loadMessages = async () => {
    const msgs = await AsyncStorage.getItem('messages' + contact.id) || [];
    setMessages(JSON.parse(msgs));
    setLoading(false);
  }

  const cacheMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem('messages' + contact.id, JSON.stringify(newMessages));
    } catch (error) {
      console.log(error);
    }
  }

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

  const renderInputToolbar = (props) => {
    if (isConnected === true) {
      return <InputToolbar {...props} />;
    } else null;
  }

  return (
    <View style={[styles.container, { backgroundColor: activeColor }]}>
      {/* Library responsible to create a chat UI */}
      {loading ? <ActivityIndicator size="large" color="#000" /> :
        <GiftedChat
          styles={[styles.container, { backgroundColor: activeColor }]}
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: userID,
            name: name,
          }}
          renderBubble={renderBubble}
          renderUsernameOnMessage={true}
          renderSystemMessage={renderSystemMessage}
          renderDay={renderDay}
          renderInputToolbar={renderInputToolbar}
        />
      }
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