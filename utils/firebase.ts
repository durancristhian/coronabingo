import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
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

const db = firebaseApp.firestore()

const { Timestamp } = firebase.firestore

const roomsRef = db.collection('rooms')

const createBatch = () => db.batch()

export { analytics, createBatch, roomsRef, Timestamp }
