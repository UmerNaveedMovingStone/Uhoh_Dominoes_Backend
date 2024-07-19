const firebase = require("firebase/app")
const FieldValue = require('firebase-admin').firestore.FieldValue;
const firestore = require("firebase-admin").firestore;
const {updateDogWin, updateDogLoss} = require("./DataController/KennelController");

async function postWager(email, amount, successCallback, failureCallback){
    const db = firestore();

    const userRef = await db.collection('users').where("email", "==", email).get();
        userRef.docs.forEach((doc)=>{
            if(doc){
                var data = doc.data();

                if (data.email === email){
                    if (amount <= (data.balance - 5000)){
                        
                        db.collection('users').doc(doc.id).update({
                            balance: (data.balance - amount)
                            
                        }).then(async ()=>{
                            const wagerDocRf = await db.collection('wager').doc();
                            wagerDocRf.set({
                                host: email,
                                amount: amount
                            }).then(async ()=>{
                                db.collection('users').doc(doc.id).update({
                                    wagers: FieldValue.arrayUnion(wagerDocRf)
                                }).then(()=>{
                                    successCallback((data.balance - amount));
                                })
                                
                            }).catch((error)=>{
                                console.log(error)
                                failureCallback(error);
                            })

                            
                        }).catch((error)=>{
                            console.log(error)
                            failureCallback(error);
                        })
                    }
                    else{
                        failureCallback("Insufficient Balance")
                    }
                    
                }
            }


        })


    
}


async function acceptWager(hostEmail, userEmail, amount, successCallback, failureCallback){
    const db = firestore();
    const matchRef = await db.collection('match').doc();
    const userRef = await db.collection('users').where("email", "==", userEmail).get();
    const hostRef = await db.collection('users').where("email", "==", hostEmail).get();
    const wagerRef = await db.collection('wager').where("host", "==", hostEmail).where("amount", "==", amount).get();
    userRef.docs.forEach(async (doc)=>{
        if(doc){
            var data = doc.data();
            if (data.email === userEmail){
                if (amount <= (data.balance - 5000)){
                    var promise = new Promise(async(resolve, reject)=>{
                        if (wagerRef.docs.length < 1){
                            reject("no wager found");
                        }
                        else{
                            
                            wagerRef.docs.forEach(async (doc1)=>{
                                if (doc1){
                                    console.log(doc1.ref);
                                    db.collection('users').doc(doc.id).update({
                                        balance: (data.balance - amount)
                                    }).then(()=>{
                                        hostRef.docs.forEach(async (doc2)=>{
                                            if (doc2){
                                                var data2 = doc2.data();
                                                if(data2.email === hostEmail){
                                                    db.collection('users').doc(doc2.id).update({
                                                        wagers: FieldValue.arrayRemove(doc1.ref)
                                                    }).then(()=>{
                                                        doc1.ref.delete();
                                                    })
                                                }
                                            }
                                        })
                                        
                                    })    
                                }
                                else{
                                    reject("no wager found");
                                }
                            })
                            resolve((data.balance - amount))
                        }
                        
                        
                        
                    })

                    promise.then((updatedBalance)=>{
                        matchRef.set({
                            host: hostEmail,
                            joined: userEmail,
                            winAmount: amount
                        }).then(()=>{
                            successCallback(updatedBalance)
                        })
                        
                    }).catch((err)=>{
                        failureCallback(err);
                    })
                }
                else{
                    failureCallback("insufficient balance")
                }

            }
            else{
                failureCallback("no host found")
            }
        }
        else{
            failureCallback("no host found")
        }
    })
    
}

async function endWager(hostEmail, amount, successCallback, failureCallback){
    const db = firestore();

    const hostRef = await db.collection('users').where("email", "==", hostEmail).get();
    const wagerRef = await db.collection('wager').where("host", "==", hostEmail).where("amount", "==", amount).get();
    hostRef.docs.forEach(async (doc)=>{
        if(doc){
            var data = doc.data();
            if (data.email === hostEmail){
                var promise = new Promise(async(resolve, reject)=>{
                    if (wagerRef.docs.length < 1){
                        reject("no wager found");
                    }
                    else{
                        
                        wagerRef.docs.forEach(async (doc1)=>{
                            if (doc1){
                                console.log(doc1.ref);
                                db.collection('users').doc(doc.id).update({
                                    balance: (data.balance + amount)
                                }).then(()=>{
                                    hostRef.docs.forEach(async (doc2)=>{
                                        if (doc2){
                                            var data2 = doc2.data();
                                            if(data2.email === hostEmail){
                                                db.collection('users').doc(doc2.id).update({
                                                    wagers: FieldValue.arrayRemove(doc1.ref)
                                                }).then(()=>{
                                                    doc1.ref.delete();
                                                })
                                            }
                                        }
                                    })
                                    
                                })    
                            }
                            else{
                                reject("no wager found");
                            }
                        })
                        resolve((data.balance + amount))
                    }
                    
                    
                    
                })

                promise.then((updatedBalance)=>{
                    successCallback(updatedBalance)
                    
                }).catch((err)=>{
                    failureCallback(err);
                })

            }
            else{
                failureCallback("no host found")
            }
        }
        else{
            failureCallback("no host found")
        }
    })




    // if (wagerRef.docs.length < 1){
    //     failureCallback("no wager found")
    // }
    // else{
    //     wagerRef.docs.forEach(async (doc1)=>{
    //         if (doc1){
    //             console.log(doc1.ref);
    //             doc1.ref.delete().then(()=>{
    //                 successCallback();
    //             });
    //             if (userRef.docs.length < 1){
    //                 failureCallback("no user found")
    //             }
    //             else{
    //                 userRef.docs.forEach(async (doc)=>{
    //                     if(doc){

    //                     }
    //                 })
    //             }
                
    //         }
    //         else{
    //             failureCallback("no wager found in list")
    //         }
    //     })
    // }

}

async function endMatch(winEmail, hostEmail, loseEmail, amount, winDog, loseDog, successCallback, failureCallback){
    const db = firestore();
    var joinEmail = "";
    if (hostEmail === winEmail){
        joinEmail = loseEmail
    }
    else{
        joinEmail = winEmail;
    }
    const userRef = await db.collection('users').where("email", "==", winEmail).get();
        userRef.docs.forEach((doc)=>{
            if(doc){
                var data = doc.data();

                if (data.email === winEmail){
                    
                    db.collection('users').doc(doc.id).update({
                        balance: (data.balance + amount + amount)
                    }).then(async ()=>{
                        const matchRef = await db.collection('match').where("host", "==", hostEmail).where("joined", "==", joinEmail).where("winAmount", "==", amount).get();
                        matchRef.docs.forEach(async (doc1)=>{
                            if (doc1){
                                db.collection('match').doc(doc1.id).update({
                                    winner: winEmail,
                                    loser: loseEmail,
                                    winDog: winDog,
                                    loseDog: loseDog
                                }).then(async()=>{
                                    var promise = new Promise(async(resolve, reject)=>{
                                        updateDogWin(winEmail, winDog, (dog)=>{
                                            console.log("attr of win dog: "+dog)
                                            updateDogLoss(loseEmail, loseDog, (dog1)=>{
                                                console.log("attr of lose dog: "+dog1)
                                                resolve("match ended")
                                            }, (err1)=>{
                                                reject(err1)
                                            })
                                        }, (err)=>{
                                            reject(err)
                                        })
                                    })

                                    promise.then((msg)=>{
                                        successCallback(msg)
                                    }).catch((error)=>{
                                        failureCallback(error)
                                    })

                                    
                                }).catch((error)=>{
                                    console.log(error)
                                    failureCallback(error);
                                })
                            }
                        })
                    }).catch((error)=>{
                            console.log(error)
                            failureCallback(error);
                    })
                }
            }


        })


    
}




module.exports = {
    postWager: postWager,
    acceptWager: acceptWager,
    endMatch: endMatch,
    endWager: endWager
}