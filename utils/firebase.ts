import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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

let firebaseApp: firebase.app.App

if (firebase.apps.length) {
  firebaseApp = firebase.apps[0]
} else {
  firebaseApp = firebase.initializeApp(firebaseConfig)
}

let analytics: firebase.analytics.Analytics

if (typeof window !== 'undefined') {
  analytics = firebaseApp.analytics()
}

const auth = firebaseApp.auth()
const db = firebaseApp.firestore()
const storage = firebaseApp.storage().ref()

const { Timestamp } = firebase.firestore

const roomsRef = db.collection('rooms')
const eventsRef = db.collection('events')

const createBatch = () => db.batch()

export {
  analytics,
  auth,
  createBatch,
  db,
  eventsRef,
  firebaseApp,
  roomsRef,
  storage,
  Timestamp,
}
