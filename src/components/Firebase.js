import firebase from "@firebase/app";
import FirebaseContext from "./context";
import React from "react";
import "@firebase/firestore";

const config = {
  apiKey: "AIzaSyCR2YqjZ2pSJ45dj50QOamY8QS3XAU9zaQ",
  authDomain: "quick-draw-8d3c4.firebaseapp.com",
  databaseURL: "https://quick-draw-8d3c4.firebaseio.com",
  projectId: "quick-draw-8d3c4",
  storageBucket: "",
  messagingSenderId: "980369905463"
};
class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }
  airplanes = () => this.db.collection("airplanes");
}
export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
export default Firebase;
export { FirebaseContext };
