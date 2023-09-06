import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB_Q2TDzVImbBfOFXLFn3St42H00Bj8hIc",
    authDomain: "sistemachamados-bfa4a.firebaseapp.com",
    projectId: "sistemachamados-bfa4a",
    storageBucket: "sistemachamados-bfa4a.appspot.com",
    messagingSenderId: "1046275519784",
    appId: "1:1046275519784:web:1e611885fd561248b7cc1d"
  };

const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)