import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const Chat = ({ route, db }) => {
  const [messages, setMessages] = useState([]);

  // Extract user ID and name passed from the Start screen
  const { userID, name } = route.params;

  useEffect(() => {
    // Query for messages, sorted by createdAt in descending order
    const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesFirestore = snapshot.docs.map((doc) => {
        const firebaseData = doc.data();
        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        };

        // Convert Firestore timestamp to JavaScript Date object
        if (firebaseData.createdAt) {
          data.createdAt = firebaseData.createdAt.toDate();
        }

        return data;
      });

      // Update local messages state
      setMessages(messagesFirestore);
    });

    // Unsubscribe from updates when component unmounts
    return () => unsubscribe();
  }, []);

  // Handles sending of new messages
  const onSend = (newMessages = []) => {
    const message = newMessages[0];
    if (!message.text.trim()) return; // Avoid sending empty messages

    // Add new message to Firestore
    addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: new Date(),
    });
  };

  // Customize the appearance of chat bubbles
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#007AFF" }, // Style for sent messages
        left: { backgroundColor: "#f0f0f0" }, // Style for received messages
      }}
    />
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID, // Current user's ID
          name: name, // Current user's name
        }}
        renderBubble={renderBubble}
      />
      {/* Adjust the view when the keyboard is displayed on Android */}
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Chat background color
  },
});

export default Chat;
