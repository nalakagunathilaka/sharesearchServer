const firebase = require('firebase');

var config = {
    apiKey: "AIzaSyBmyzHBPtyDxZq1cD5Tc5wCis_xFgngAas",
    authDomain: "se-project-2a33c.firebaseapp.com",
    databaseURL: "https://se-project-2a33c.firebaseio.com",
    projectId: "se-project-2a33c",
    storageBucket: "se-project-2a33c.appspot.com",
    messagingSenderId: "428197635205"
};

const connection = firebase.initializeApp(config);
const db = connection.database();
const auth = connection.auth();

exports.database = db;
exports.authentication = auth;