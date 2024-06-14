import React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

// Generate mock contacts
const mockContacts = [
  {
    id: 2,
    name: 'Elon Musk',
    // require gets the image in the location indicated
    avatar: require("../assets/elon-musk.jpg"),
    phone: '(+49) 123-456-7899',
  }, {
    id: 3,
    name: 'Mark Zuckerberg',
    avatar: require("../assets/mark-zuck.png"),
    phone: '(+49) 123-446-7891',
  }
];

// Contact UI
const ContactList = ({ route, navigation }) => {
  // Params received from the previous screen
  const { name, activeColor } = route.params;

  const renderItem = ({ item }) => (
    // Calls Chat UI with the selected contact info
    <TouchableOpacity onPress={() => navigation.navigate('Chat',
      { name: name, activeColor: activeColor, contact: item })}
    >
      <ListItem
        containerStyle={styles.listItem}>
        <Avatar source={item.avatar} rounded={true} />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: 'bold' }}>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.phone}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: activeColor }]}>

      <FlatList
        data={mockContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    backgroundColor: '#FFEFE6',
    margin: 10,
    marginBottom: 0,
    borderWidth: 0.2,
    borderColor: "#000",
    borderRadius: 2
  }
});

export default ContactList;
