var express = require('express');
var router = express.Router();
var firebaseSDK = require('firebase');

//importing the database
const firebase = require('../database/database');


router.post('/getMessages',(req,res,next) =>{
    var key = req.body.key;
    var chatRef = firebase.database.ref('messages/'+key);

    chatRef.orderByChild('date').once('value', (snapshot)=> {
        res.send(snapshot.val());
    })
});


module.exports = router