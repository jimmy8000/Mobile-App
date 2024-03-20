import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";

const Start = ({ navigation }) => {
  // State hooks for handling user input and selected color
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Predefined set of colors for background selection
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  return (
    <ImageBackground
      style={styles.container}
      source={require("./assets/bgImage.png")}
    >
      <View>
        <Text style={styles.title}>App Title</Text>
      </View>
      <View style={styles.bottomContainer}>
        {/* User name input section */}
        <View style={styles.textInputContainer}>
          <Image
            source={require("./assets/icon.png")}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#757083"
          />
        </View>

        {/* Background color selection section */}
        <View style={styles.middleContainer}>
          <Text style={styles.chooseColor}>Choose a background color:</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color} // Unique key for each color
                onPress={() => setSelectedColor(color)} // Set selected color
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: color,
                  margin: 2,
                }}
              />
            ))}
          </View>
        </View>

        {/* Button to navigate to Chat screen with selected options */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Chat", {
              name: name,
              selectedColor: selectedColor,
            })
          }
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// StyleSheet for component styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    color: "#fff",
    fontWeight: "600",
  },
  bottomContainer: {
    backgroundColor: "white",
    width: "88%",
    height: "44%",
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  middleContainer: {
    height: "25%",
    justifyContent: "space-around",
    alignSelf: "flex-start",
    marginLeft: 25,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    padding: 15,
    borderWidth: 1,
    fontSize: 16,
    color: "#757083",
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 20,
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
  },
  colorContainer: {
    flexDirection: "row",
    gap: 10,
    width: "88%",
  },
  button: {
    backgroundColor: "#757083",
    padding: 10,
    borderRadius: 5,
    width: "88%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Start;
