import React,{useEffect, useState} from 'react';
import { initializeApp } from "firebase";
import { getAuth,createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAQmGE66ACzypXy-bzT6bXtEJ-IHf8ANMg",
  authDomain: "bettimers.firebaseapp.com",
  databaseURL: "https://bettimers-default-rtdb.firebaseio.com",
  projectId: "bettimers",
  storageBucket: "bettimers.appspot.com",
  messagingSenderId: "926730575178",
  appId: "1:926730575178:web:280198eab648a1432675b3",
  measurementId: "G-E0ZL9RFHH1"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth()
export function signUp(email, password){
  return createUserWithEmailAndPassword(auth, email, password);
}
export function signIn(email,password){
  return signInWithEmailAndPassword(auth,email,password);
}
export function sendRequestResetEmail(email){
  return auth.sendPasswordResetEmail(email);
}

export function logOut(){
  return auth.signOut();
}
export function useAuth(){
  const [currentUser, setCurrentUser] = React. useState();
  useEffect(() =>{
    const isAuthticated = auth.onAuthStateChanged ( user => {
      setCurrentUser(user);
      let a = user ? user.uid : "";
      localStorage.setItem("isAuthenticated",a );
    });
    return isAuthticated;
  }, []);
  return currentUser;
}

export const dbUsers = app.database().ref('/datas/users');
export const dbPackages = app.database().ref('/datas/packages');

