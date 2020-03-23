import firebase from 'firebase/app'
import 'firebase/firestore'

/* TODO: configure an .env file */
const firebaseConfig = {
  apiKey: 'AIzaSyChj93kMbADsP58d-LMCbKZlaZxtwZsi9k',
  authDomain: 'coronabingo-dev.firebaseapp.com',
  databaseURL: 'https://coronabingo-dev.firebaseio.com',
  projectId: 'coronabingo-dev',
  storageBucket: 'coronabingo-dev.appspot.com',
  messagingSenderId: '595363826914',
  appId: '1:595363826914:web:f56e557be9c1454b6522bb',
  measurementId: 'G-FX1XBFGWLB'
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
