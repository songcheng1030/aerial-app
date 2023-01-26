// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  writeBatch,
} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCxezBmsnU0BAYzZ-IhvDYY8YzN7iX-RXA',
  authDomain: 'playpen2-288ef.firebaseapp.com',
  projectId: 'playpen2-288ef',
  storageBucket: 'playpen2-288ef.appspot.com',
  messagingSenderId: '383766240228',
  appId: '1:383766240228:web:8b861cd9aa6ec2c38805f1',
  measurementId: 'G-TCNEPLYV3D',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
initializeFirestore(app, { ignoreUndefinedProperties: true })
export const db = getFirestore(app)
export const auth = getAuth(app)

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export const mkBatch = () => writeBatch(db)
