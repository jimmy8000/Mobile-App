import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, TouchableOpacity, Alert } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";
import { Audio } from "expo-av";

const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const [messages, setMessages] = useState([]);
  const { name, userID } = route.params;
  const {selectedColor} = route.params;
  let soundObject = null;

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} containerStyle={styles.input} />;
    else return null;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  const renderCustomActions = (props) => {
    return <CustomActions onSend={onSend} storage={storage} {...props} userID={userID} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  const renderMessageAudio = (props) => {
    return (
        <View {...props}>
            <TouchableOpacity
                style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
                onPress={async () => {
                    try {
                        // Log the URI for debugging
                        console.log("Playing sound from URI:", props.currentMessage.audio);
                        
                        // Stop and unload any currently playing sound first
                        if (soundObject) {
                            await soundObject.unloadAsync();
                            soundObject.setOnPlaybackStatusUpdate(null); // Remove event listener
                            soundObject = null;
                        }

                        // Create a new sound object
                        soundObject = new Audio.Sound();
                        await soundObject.loadAsync({ uri: props.currentMessage.audio });
                        soundObject.setOnPlaybackStatusUpdate((status) => {
                            if (status.didJustFinish && !status.isLooping) {
                                soundObject.unloadAsync(); // Unload after playing
                            }
                        });
                        await soundObject.playAsync();
                    } catch (error) {
                        console.error("Error playing sound:", error);
                        Alert.alert("Playback Error", "Failed to play sound.");
                    }
                }}
            >
                <Text style={{ textAlign: "center", color: 'black', padding: 5 }}>
                    Play Sound
                </Text>
            </TouchableOpacity>
        </View>
    );
};


  useEffect(() => {
    navigation.setOptions({ title: name });
  
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
  
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }
  
    return () => {
      if (unsubMessages) unsubMessages();
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);
  
  
  

  return (
    <View style={[styles.container, {backgroundColor: selectedColor}]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderMessageAudio}
        user={{
          _id: userID,
          name,
        }}
      />

      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    paddingBottom: 5,
  }
});