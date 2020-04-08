import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

let firebaseApp

if (firebase.apps.length) {
  firebaseApp = firebase.apps[0]
} else {
  firebaseApp = firebase.initializeApp(firebaseConfig)
}

const db = firebaseApp.firestore()

export default db
export const roomsRef = db.collection('rooms')
