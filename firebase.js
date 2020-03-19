import firebase from 'firebase/app'
import 'firebase/firestore'

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

if (firebase.apps.length) {
  firebase.apps[0]
} else {
  firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()

export default db
