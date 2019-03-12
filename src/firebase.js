import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyDTNJQlMfgCu8MCi5zVtxCyr5njj2aSEKc",
  authDomain: "fir-cookbook-7995f.firebaseapp.com",
  databaseURL: "https://fir-cookbook-7995f.firebaseio.com",
  projectId: "fir-cookbook-7995f",
  storageBucket: "fir-cookbook-7995f.appspot.com",
  messagingSenderId: "586731210889"
};
firebase.initializeApp(config);
export default firebase;
