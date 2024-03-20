import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Start from "./components/Start";
import Chat from "./components/Chat";


const Stack = createNativeStackNavigator();

const App = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyBL66w1oja4MWbZ52jFl-Y0iyubslkSvEI",
    authDomain: "chatapp-e4c0e.firebaseapp.com",
    projectId: "chatapp-e4c0e",
    storageBucket: "chatapp-e4c0e.appspot.com",
    messagingSenderId: "443158136667",
    appId: "1:443158136667:web:4661c21374455d4f49fc7e",
    measurementId: "G-16LQSGFVSZ"
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat">
          {props => <Chat db={db} {...props} />}
        </ Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;