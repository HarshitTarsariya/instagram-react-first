import firebase from "firebase"

const firebaseapp=firebase.initializeApp({
    apiKey: "AIzaSyAXdhLvdfjzmSjFc4Nl5lVMjI1qzEgoFDU",
    authDomain: "instagram-react-first.firebaseapp.com",
    projectId: "instagram-react-first",
    storageBucket: "instagram-react-first.appspot.com",
    messagingSenderId: "445206952961",
    appId: "1:445206952961:web:190e3354be2c168b409400",
    measurementId: "G-CHC6C4YZ3W"
})
const db=firebaseapp.firestore()
const auth=firebaseapp.auth()
const storage=firebaseapp.storage()

export { db,auth,storage}