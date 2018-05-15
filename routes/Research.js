var express = require('express');
var router = express.Router();
var firebaseSDK = require('firebase');


const firebase = require('../database/database');


router.post('/addResearch', (req, res) => {
    var resKey = firebase.database.ref().child('researches').push().key;
    var resRef = firebase.database.ref('researches');

    resRef.child(resKey).set({
        Name: req.body.name,
        Field: req.body.field,
        Category: "Single",
        Username: req.body.username,
        Researcher: req.body.Researcher,
        Description: req.body.description,
        Publish_Date: req.body.submitdate,
        Details: req.body.details,
    }).then((result) => {
        res.send({success: true, message: 'Research added successfully'});
    }).catch((err) => {
        console.log(err);
        res.send({success: true, message: err.message});
    })
});

// router.get('/getResearches', (req, res) => {
//     var resRef = firebase.database.ref('researches');
//     var user = firebase.authentication.currentUser;
//     if (user != null) {
//         console.log('User is signed in');
//     } else {
//         console.log('User is not signed in');
//     }
//
//     var userRef = firebase.database.ref('users').child(user.uid);
//     userRef.on("value", (snapshot) =>{
//         var username = snapshot.child('Username').val();
//         console.log(username);
//         resRef.orderByChild("Username").equalTo(username).once("value", (snapshot) =>{
//             console.log(snapshot.val());
//             res.json(snapshot.val());
//         }, (error) => {
//             console.log(error.message);
//         })
//         })
//     }, (error) => {
//         console.log(error.message);
// });

router.get('/getResearches', (req, res) => {
    var resRef = firebase.database.ref('researches');

    resRef.once("value", (snapshot) => {
        res.send(snapshot.val());
        console.log(snapshot.val());
    })
}, (error) => {
    console.log(error.message);
});

router.post('/submitJob', (req, res) => {
    var jobKey = firebase.database.ref().child('jobs').push().key;
    var jobRef = firebase.database.ref('jobs');

    jobRef.child(jobKey).set({
        Job_Title: req.body.name,
        Field: req.body.field,
        Username: req.body.username,
        Contact_Details: req.body.contact,
        Description: req.body.description,
        Date: req.body.submitdate,
    }).then((result) => {
        res.send({success: true, message: 'Job added successfully'});
    }).catch((err) => {
        console.log(err);
        res.send({success: true, message: err.message});
    })
});

router.get('/getJobs', (req, res) => {
    var jobRef = firebase.database.ref('jobs');
    jobRef.once("value", (snapshot) => {
        // console.log(snapshot.val());
        res.send(snapshot.val())
    })
});

router.post('/addGroupResearch', (req, res, next) => {
    var resKey = firebase.database.ref().child('researches').push().key;
    var resRef = firebase.database.ref('researches');
    var messageRef = firebase.database.ref('messages');

    resRef.child(resKey).set({
        Name: req.body.name,
        Field: req.body.field,
        Category: "Group",
        Groupname: req.body.groupname,
        Description: req.body.description,
        Details: req.body.details,
        StartDate: req.body.startDate,
        Members: req.body.members

    }).then((result) => {
        messageRef.child(resKey).push({
            username: 'System',
            text: 'Group Created',
            date: new Date().toISOString()
        })
            .then((result) => {
                res.send({success: true, message: 'Research added successfully'});
            })
            .catch((error) => {
                console.log(error);
            });

    }).catch((err) => {
        console.log(err);
        res.send({success: true, message: err.message});
    })
});

router.get('/getGroupResearches', (req, res) => {
    var resRef = firebase.database.ref('researches');

    resRef.once("value", (snapshot) => {
        res.send(snapshot.val());
    })
}, (error) => {
    console.log(error.message);
});

router.post('/getCurrentResearch', (req, res, next) => {
    var resRef = firebase.database.ref('researches');
    resRef.orderByChild('Name').equalTo(req.body.name).once("value", (snapshot) => {
        var key = Object.keys(snapshot.val())[0];
        res.json({successs: true, research: snapshot.val(), key: key});
    })
});

router.post('/updateResearch', (req, res, next) => {
    var resRef = firebase.database.ref('researches');
    var key = req.body.key;

    resRef.child(key).update({
        Name: req.body.name,
        Username: req.body.username,
        Description: req.body.description,
        Publish_Date: req.body.publishdate,
        Field: req.body.field,
        Researcher: req.body.Researcher,
        Details: req.body.details

    }).then((result) => {
        res.send({success: true, message: 'Project updated successfully'});
    }).catch((err) => {
        console.log(err);
        res.send({success: true, message: err.message});
    })
});

router.post('/getCurrentResearch', (req, res, next) => {
    var resRef = firebase.database.ref('researches');
    resRef.orderByChild('Name').equalTo(req.body.name).once("value", (snapshot) => {
        var key = Object.keys(snapshot.val())[0];
        res.json({successs: true, research: snapshot.val(), key: key});
    })
});




module.exports = router;