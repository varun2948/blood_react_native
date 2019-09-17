import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from "firebase";
import { AppContainer } from './StackNavigation';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB3jDfd9mzGHXp3TgCuIjorPA2CpaoWwdA",
  authDomain: "blood-2f078.firebaseapp.com",
  databaseURL: "https://blood-2f078.firebaseio.com",
  projectId: "blood-2f078",
  storageBucket: "",
  messagingSenderId: "408502980654",
  appId: "1:408502980654:web:2c3ff1add59c9bc7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default function App() {
  return (
    <AppContainer />



  );
}