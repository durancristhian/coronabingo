import 'firebase/analytics'
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

let firebaseApp: firebase.app.App
let analytics: firebase.analytics.Analytics

if (firebase.apps.length) {
  firebaseApp = firebase.apps[0]
} else {
  firebaseApp = firebase.initializeApp(firebaseConfig)
}

if (typeof window !== 'undefined') {
  analytics = firebase.analytics()
}

const db = firebaseApp.firestore()
const roomsRef = db.collection('rooms')

export default db
export { analytics, roomsRef }
