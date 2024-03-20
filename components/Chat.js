import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Chat component handling the chat UI and logic
const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);

  // Initialize chat messages on component mount
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: 'You entered a chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // Function to handle sending new messages
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  // Customizes the appearance of chat bubbles
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#007AFF" }, // Sent messages
        left: { backgroundColor: "#f0f0f0" }, // Received messages
      }}
    />
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{ _id: 1 }}
      />
      {/* KeyboardAvoidingView for Android to handle keyboard overlap */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

// Styles for the chat screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background for chat
  },
});

export default Chat;
