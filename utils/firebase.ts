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

const uiTests = process.env.UI_TESTS === '1'
let analytics: firebase.analytics.Analytics | undefined

if (typeof window !== 'undefined' && !uiTests) {
  analytics = firebaseApp.analytics()
}

const db = firebaseApp.firestore()
if (uiTests) {
  if (
    process.env.PROJECT_ID !== 'demo-coronabingo-ui' ||
    process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8187'
  ) {
    throw new Error('UI tests require the local demo Firestore emulator.')
  }
  db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false })
}

const { FieldValue, Timestamp } = firebase.firestore

const roomsRef = db.collection('rooms')

const createBatch = () => db.batch()

export { analytics, createBatch, FieldValue, roomsRef, Timestamp }
