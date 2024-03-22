import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, db, isConnected }) => {
  const [messages, setMessages] = useState([]);

  const { userID, name } = route.params;

  useEffect(() => {
    if (isConnected) {
      const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesFirestore = snapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (firebaseData.createdAt) {
            data.createdAt = firebaseData.createdAt.toDate();
          }

          return data;
        });

        setMessages(messagesFirestore);
        // Cache messages
        AsyncStorage.setItem('messages', JSON.stringify(messagesFirestore));
      });

      return () => unsubscribe();
    } else {
      // Load cached messages if offline
      AsyncStorage.getItem('messages').then((storedMessages) => {
        if (storedMessages) setMessages(JSON.parse(storedMessages));
      }).catch(error => console.log(error));
    }
  }, [isConnected]);

  const onSend = (newMessages = []) => {
    if (!isConnected) {
      Alert.alert("You are offline", "Messages can only be sent when online.");
      return;
    }

    const message = newMessages[0];
    if (!message.text.trim()) return;

    addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: new Date(),
    });
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#007AFF" },
        left: { backgroundColor: "#f0f0f0" },
      }}
    />
  );

  // Custom renderInputToolbar to hide when offline
  const renderInputToolbar = (props) => {
    if (!isConnected) return null;
    return <InputToolbar {...props} />;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Chat;
