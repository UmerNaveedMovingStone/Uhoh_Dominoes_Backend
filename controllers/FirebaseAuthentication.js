const firebase = require("firebase/app");
const firebaseAdmin = require("firebase-admin");
const constants = require("../utils/Constants");


function login(user, successCallback, failureCallback){
    //first check if email is verified
    firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((userCredentials)=>{
        var currentUser = userCredentials.user;
        if(currentUser.emailVerified){
            //update user state
            updateUserState(user.email, true, function(kennelName){
                successCallback(userCredentials, kennelName);
            }, function(error){
                failureCallback(error.message)
            })

        }
        else{
            failureCallback("Please Verify Your Email First")
        }

    }).catch((error)=>{
        failureCallback(error.message);
    }) 

}

function signup(user, successCallback, failureCallback){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userCredential)=>{
        var currentUser = userCredential.user;
        currentUser.updateProfile({
            displayName: user.username 
        })
        currentUser.sendEmailVerification().then(()=>{
            storeUserData(user, function(){
                successCallback(userCredential);
            }, function(error){
                failureCallback(error)
            })

        })

    }).catch((error)=>{
        failureCallback(error);
    })
}

function resendVerificationEmail(email, successCallback, failureCallback){
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const currentUser = firebase.auth().currentUser;
        currentUser.sendEmailVerification().then(()=>{
            console.log("email verification sent")
            successCallback();
        }).catch(err => {
            console.log("error occurred while sending verification email: " + err);
            failureCallback(err.message);
        })


    })
}

function logoutUser(email, successCallback, failureCallback){
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {
        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const currentUser = firebase.auth().currentUser;
        await updateUserState(currentUser.email, false, () => {
            successCallback();
        }, (error) => {
            failureCallback(error);
        })

    })
}

async function updateUserState(email, state, successCallback, failureCallback){
    const db = firebase.firestore();
    const userRef = await db.collection('users').where("email", "==", email).get();
    userRef.docs.forEach(async (doc)=>{
        if(doc){
            var data = doc.data();

            if (data.email === email){
               // var kennelDocRef = data.kennel;
                
                //const kennelDoc = await kennelDocRef.get();
                //const kennelData = kennelDoc.data();

                //console.log("kennel doc: "+kennelData.name);
                db.collection('users').doc(doc.id).update({
                    state: state
                }).then(()=>{
                    successCallback(true);
                }).catch((error)=>{
                    failureCallback(error);
                })
            }
        }


    })

}

/*async function updateUserState(email, state, successCallback, failureCallback){
    const db = firebase.firestore();
    const userRef = await db.collection('users').where("email", "==", email).get();
    userRef.docs.forEach(async (doc)=>{
        if(doc){
            var data = doc.data();

            if (data.email === email){
               // var kennelDocRef = data.kennel;
                
                //const kennelDoc = await kennelDocRef.get();
                //const kennelData = kennelDoc.data();

                //console.log("kennel doc: "+kennelData.name);
                db.collection('users').doc(doc.id).update({
                    state: state
                }).then(()=>{
                    console.log(data);
                    const kenData = {
                        "kennelName": kennelData.name,
                        "skinName": kennelData.skinName 
                    }
                    console.log(kenData)
                    successCallback(kenData);
                }).catch((error)=>{
                    failureCallback(error);
                })
            }
        }


    })

}*/

async function getAllUserData(email, successCallback, failureCallback){
    var usernameArr = [];
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {
        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();
        const userRef = await db.collection('users').get();
        userRef.docs.forEach((doc)=>{
            if(doc) {
                var data = doc.data();

                usernameArr.push(data.username)

            }
        })
        if (usernameArr.length !== 0) {
            successCallback(usernameArr)
        }
        else{
            failureCallback("some error occurred")
        }

    })



}

async function getBalance(email, successCallback, failureCallback){
    const db = firebaseAdmin.firestore();
    const userRef = await db.collection('users').where("email", "==", email).get();
    userRef.docs.forEach((doc)=>{
        if(doc){
            var data = doc.data();

            if (data.email === email){
                successCallback(data.balance);
            }
            else{
                failureCallback("no user found")
            }
        }
        else{
            failureCallback("no user found");
        }


    })

}

function storeUserData(user, successCallback, failureCallback){
    const db = firebase.firestore();
    db.collection('users').doc().set({
        email: user.email,
        username: user.username,
        state: false,
        balance: constants.initialBalance
    }).then(()=>{
        successCallback()
    }).catch((error)=>{
        failureCallback(error)
    })
}

function forgotPassword(email, successCallback, failureCallback){
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const currentUser = firebase.auth().currentUser;
        firebase.auth().sendPasswordResetEmail(email).then(()=>{
            console.log("password reset email sent")
            successCallback();
        }).catch(err => {
            console.log("error occurred while sending password reset email: " + err);
            failureCallback(err.message);
        })
    })
}

function deleteuser(email, successCallback, failureCallback){
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const currentUser = firebase.auth().currentUser;
        const db = firebase.firestore();
        const userRef = await db.collection('users').where("email", "==", email).get();
        
         //currentUser.delete().then(()=>{
            userRef.docs.forEach((doc)=>{
                  if(doc){
                        var data = doc.data();
                          if (data.email === email){
                               // db.collection('users').doc(doc.id).delete();
                                //doc().delete();
                                successCallback();
                          }else{
                                failureCallback("no user found")
                          }
                  }      
           // });
            console.log("User Account Deleted");
            successCallback();
        }).catch(err => {
            console.log("error occurred while trying to delete user: " + err);
            failureCallback(err.message);
        })

    })
}


module.exports = {
    login: login,
    signup: signup,
    resendVerificationEmail: resendVerificationEmail,
    logoutUser: logoutUser,
    getAllUserData: getAllUserData,
    getBalance: getBalance,
    forgotPassword: forgotPassword,
    deleteuser: deleteuser
}
