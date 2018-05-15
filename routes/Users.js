var express = require('express');
var router = express.Router();
var firebaseSDK = require('firebase');

const firebase = require('../database/database');

/*router.post('/login',(req,res) => {
    console.log('woww');
    var userReference = firebase.database.ref('users');
    userReference.orderByChild("Name").equalTo('Nalaka').on("value", (snapshot) =>{
        console.log("FBJSDKSFD");
        console.log(snapshot.val());
        res.json({user: snapshot.val()});
    }, (error) => {
        console.log(error.message);
    })
});*/

// Getting the post from Create Account vue component. and enter the details to the database. Then send the response back.
router.post('/CreateAccount', (req, res, next) => {

    var userRef = firebase.database.ref('users');

    function usernameExists(exists) {
        if (exists) {
            res.json({success: false, message: "Username already taken"});
        }
        else {
            firebase.authentication.createUserWithEmailAndPassword(req.body.email, req.body.password)
                .then((result) => {
                    userRef.child(result.uid).set({
                        Type: req.body.type,
                        Name: req.body.name,
                        Username: req.body.userName,
                        Field: req.body.field,
                    });
                    res.json({success: true, message: "User registered successfully"});
                })
                .catch((err) => {
                    var code = err.code;
                    var errMessage = err.message;
                    if (code === 'auth/email-already-in-use') {
                        res.json({success: false, message: "Email already in use"});
                    }
                    else {
                        res.json({success: false, message: errMessage});
                    }
                });

        }

    }


    userRef.orderByChild("Username").equalTo(req.body.userName).once("value", (snapshot) => {
        var exists = (snapshot.val() !== null);
        usernameExists(exists);

    })
});

// Getting the post from Login vue component. Using firebase authentication getting validation for the user . Then send the response back.
router.post('/login', (req, res) => {
    firebase.authentication.signInWithEmailAndPassword(req.body.email, req.body.password).then((result) => {
        var loggedUser = firebase.authentication.currentUser;
        // console.log(loggedUser);
        firebase.authentication.currentUser.getIdToken(true)
            .then((token) => {
                firebase.database.ref('users').child(result.uid).once("value", (snapshot) => {
                    // console.log(snapshot.val());
                    res.json({
                        success: true,
                        message: 'User logged in successfully',
                        token: token,
                        user: snapshot.val()
                    });
                });
            });
    }).catch((error) => {
        var code = error.code;
        if (code === "auth/wrong-password") {
            res.json({success: false, message: "Incorrect password"});
        }
        else {
            res.json({success: false, message: error.message});
        }

    });

});

// Getting post from App component and logout the user if logged in.
router.post('/logout', (req, res) => {
    firebase.authentication.signOut()
        .then(() => {
            res.json({success: true, message: "Signed out"})
        })
        .catch((err) => {
            console.log(err);
            res.json({success: false, message: err.message});
        });
});

// Updating the details of the user bu getting post from profile component.
router.post('/updatePass', (req, res, next) => {
    var user = req.body.auth;
    const credentials = firebaseSDK.auth.EmailAuthProvider.credential(req.body.email, req.body.currentPass);
    // var credentials ={email: req.body.email, password: req.body.currentPass};
    firebase.authentication.currentUser.reauthenticateWithCredential(credentials).then(() => {
        firebase.authentication.currentUser.updatePassword(req.body.newPass).then(() => {
            res.json({success: true, message: "Password changed successfully"});
        }).catch((err) => {
            res.json({success: false, messsage: err.message});
        })
    }).catch((err) => {
        res.json({success: false, message: err.message});
    })
});

router.get('/getUsers', (req, res, next) => {
    var userRef = firebase.database.ref('users');
    userRef.once("value", (snapshot) => {
        // console.log(snapshot.val());
        res.send(snapshot.val())
    })
});

// still in progress
router.post('/removeUser', (req, res) => {
    var userRef = firebase.database.ref('users');
    userRef.orderByChild("Username").equalTo(req.body.username).once("value", (snapshot) => {
        console.log(snapshot);
    })
});


router.post('/complaints', (req, res) => {
    var compKey = firebase.database.ref().child('complaints').push().key;
    var complaintsRef = firebase.database.ref('complaints');
    var user = firebase.authentication.currentUser;
    if (user != null) {
       console.log('User is signed in');
       console.log(user.uid);
    } else {
        console.log('User is not signed in');
    }

    var userRef = firebase.database.ref('users').child(user.uid);
    userRef.on("value", (snapshot) =>{
        var username = snapshot.child('Username').val();
        var date = new Date().toLocaleDateString();
        var time = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
        complaintsRef.child(compKey).set({
            Complaint: req.body.complaints,
            UserID: user.uid,
            Username: username,
            Date_complaint: date,
            Time_complaint: time,
        }).then((result) => {
            res.send({success: true, message: 'Complaint added successfully'});
        }).catch((err) => {
            console.log(err);
            res.send({success: true, message: err.message});
        })
    }, (error) => {
        console.log(error.message);
    })
});

router.get('/getComplaints', (req, res) => {
    var compRef = firebase.database.ref('complaints');
    compRef.once("value", (snapshot) => {
        // console.log(snapshot.val());
        res.send(snapshot.val())
    })
});

router.post('/notifications', (req, res) => {
    var compKey = firebase.database.ref().child('notifications').push().key;
    var complaintsRef = firebase.database.ref('notifications');
    var user = firebase.authentication.currentUser;
    if (user != null) {
        console.log('User is signed in');
    } else {
        console.log('User is not signed in');
    }

    var userRef = firebase.database.ref('users').child(user.uid);
    userRef.on("value", (snapshot) =>{
        var username = snapshot.child('Username').val();
        var type = snapshot.child('Type').val();
        var date = new Date().toLocaleDateString();
        var time = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
        complaintsRef.child(compKey).set({
            Notification_body: req.body.notifications,
            UserID: user.uid,
            Username: username,
            Type: type,
            Date_notice: date,
            Time_notice: time,
        }).then((result) => {
            res.send({success: true, message: 'Notification added successfully'});
        }).catch((err) => {
            console.log(err);
            res.send({success: true, message: err.message});
        })
    }, (error) => {
        console.log(error.message);
    })
});

router.get('/getNotifications', (req, res) => {
    var noticeRef = firebase.database.ref('notifications');
    noticeRef.once("value", (snapshot) => {
        // console.log(snapshot.val());
        res.send(snapshot.val())
    })
});

router.get('/getResearches', (req, res, next) => {
    var userRef = firebase.database.ref('researches');
    userRef.once("value", (snapshot) => {
        // console.log(snapshot.val());
        res.send(snapshot.val())
    })
});


module.exports = router;