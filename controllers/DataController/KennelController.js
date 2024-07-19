const firebase = require("firebase/app")
const FieldValue = require('firebase-admin').firestore.FieldValue;
const firebaseAdmin = require("firebase-admin");

function kennelSet(kennel, successCallback, failureCallback){

}

function kennelGet(user, successCallback, failureCallback){

}

async function storeKennelData(kennel, email, successCallback, failureCallback) {


    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();
        //const currentUser = firebase.auth().currentUser;

        const userRef = await db.collection('users').where("email", "==", email).get();
        var dogsRef = [];
        for (const dog of kennel.dogs){
            console.log(dog);
            const docRef = await db.collection('dogs').doc();
            await docRef.set(Object.assign({}, dog));
            console.log(docRef);
            dogsRef.push(docRef);
        }
        console.log(dogsRef);
        const kennelRef = await db.collection('kennels').doc();
        kennelRef.set({
            name: kennel.name,
            location: kennel.location,
            skinName: kennel.skinName,
        }).then(()=>{

            for (const refs of dogsRef){
                kennelRef.update({
                    dogs: firebase.firestore.FieldValue.arrayUnion(refs)
                });
            }
            userRef.docs.forEach((doc)=>{
                if(doc){
                    var data = doc.data();

                    if (data.email === email){

                        db.collection('users').doc(doc.id).update({
                            kennel: kennelRef
                        }).then(()=>{
                            console.log(data);
                            successCallback();
                        }).catch((error)=>{
                            console.log(error);
                            failureCallback(error);
                        })
                    }
                }


            })
        }).catch((error)=>{
            console.log(error);
            failureCallback(error)
        })



    }).catch((error)=>{
        failureCallback(error);
    })



}


async function updateKennelDogs(email, dogs, successCallback, failureCallback){
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();
        //const currentUser = firebase.auth().currentUser;
        var promise = new Promise(async(resolve, reject)=>{
            const userDoc = await db.collection('users').where("email", "==", email).get();
            for (const doc of userDoc.docs) {
                if (doc){
                    var data = doc.data();
                    if (data.email === email){
                        var kennel = data.kennel;
                        var dogsRef = [];
                        var kennelDoc = await kennel.get();
                        var kennelData = kennelDoc.data();
                        for (const dogRef of kennelData.dogs){
                            var docRef = await dogRef.get();
                            var dogData = docRef.data();
                            // for (const dog of dogs){
                            //     if (dog.name.toLowerCase() === dogData.name.toLowerCase()){
                            //         reject("dog name already exists")
                            //         return;
                            //     }
                            // }
                            if (dogs.name.toLowerCase() === dogData.name.toLowerCase()){
                                reject("dog name already exists")
                                return;
                            }
                        }
                        // for (const dog of dogs){
                        //     console.log(dog);
                        //     console.log("not here")
                        //     const docRef = await db.collection('dogs').doc();
                        //     await docRef.set(Object.assign({}, dog));
                        //     console.log(docRef);
                        //     dogsRef.push(docRef);
                        // }
                        console.log(dogs);
                        console.log("not here")
                        docRef = await db.collection('dogs').doc();
                        await docRef.set(Object.assign({}, dogs));
                        console.log(docRef);
                        dogsRef.push(docRef);
                        for (const ref of dogsRef){

                            await kennel.update({
                                dogs: firebase.firestore.FieldValue.arrayUnion(ref)
                            })
                        }
                        await db.collection('users').doc(doc.id).update({
                            balance: (data.balance - 1000)
                        })
                        resolve((data.balance - 1000))

                    }
                    else{
                        reject("no such user found")
                    }
                }
                else{
                    reject("no such user found")
                    // failureCallback("no such user found")
                }
            }
        })
        promise.then((val)=>{
            console.log(val);
            successCallback(val);
        }).catch((err)=>{
            failureCallback(err);
        })
    }).catch((error)=>{
        failureCallback(error.message);
    });
}

async function deleteKennelDogs(email, dogName, successCallback, failureCallback){
    console.log(dogName)
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();

        var promise = new Promise(async(resolve, reject)=>{
            const userDoc = await db.collection('users').where("email", "==", email).get();
            for (const doc of userDoc.docs){
                if(doc){
                    var data = doc.data();
                    if(data.email === email){
                        var kennelRef = data.kennel;
                        var kennelDoc = await kennelRef.get();
                        var kennelData = kennelDoc.data();
                        var dogs = kennelData.dogs;
                        for (const dogRef of dogs){
                            var dogData = await dogRef.get();
                        
                            var oneDog = dogData.data();
                            console.log(oneDog);
                            if (oneDog.name.toLowerCase() === dogName.toLowerCase()){
                                dogRef.delete();
                                await kennelRef.update({
                                    dogs: firebase.firestore.FieldValue.arrayRemove(dogRef)
                                })
                                resolve();
                            }
                        }
                        reject("no dog found")
                        
                    }
                }
                else{
                    reject("no such user found")
                }
            }
        })

        promise.then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })

    }).catch((err)=>{
        failureCallback(err)
    })
}


async function getAllDogs(email, successCallback, failureCallback){
    var dogsArr = [];
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();
        

        var promise = new Promise(async(resolve, reject)=>{
            const userDoc = await db.collection('users').where("email", "==", email).get();
            var dogsArr = [];
            for (const doc of userDoc.docs){
                if(doc){
                    var data = doc.data();
                    if(data.email === email){
                        var kennelRef = data.kennel;
                        var kennelDoc = await kennelRef.get();
                        var kennelData = kennelDoc.data();
                        var dogs = kennelData.dogs;
                        for (const dogRef of dogs){
                            var dogData = await dogRef.get();
                        
                            var oneDog = dogData.data();
                            console.log(oneDog);
                            dogsArr.push(oneDog);
                            // if (oneDog.name.toLowerCase() === dogName.toLowerCase()){
                            //     dogRef.delete();
                            //     await kennelRef.update({
                            //         dogs: firebase.firestore.FieldValue.arrayRemove(dogRef)
                            //     })
                            //     resolve();
                            // }
                        }
                        console.log(dogsArr)
                        if (dogsArr.length != 0){
                            resolve(dogsArr)
                        }
                        else{
                            reject("no dog found")
                        }
                    }
                }
                else{
                    reject("no such user found")
                }
            }
        })

        promise.then((dogsArr)=>{
            successCallback(dogsArr);
        }).catch((err)=>{
            failureCallback(err);
        })

    }).catch((err)=>{
        failureCallback(err);
    })
}

async function updateDogWin(email, dogName, successCallback, failureCallback){
    
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();
        var promise = new Promise(async(resolve, reject)=>{
        const userDoc = await db.collection('users').where("email", "==", email).get();

        for (const doc of userDoc.docs) {
            if (doc){
                var data = doc.data();
                if (data.email === email){

                    var kennelRef = data.kennel;
                        var kennelDoc = await kennelRef.get();
                        var kennelData = kennelDoc.data();
                        var dogs = kennelData.dogs;
                        for (const dogRef of dogs){
                            var dogData = await dogRef.get();
                        
                            var oneDog = dogData.data();
                            console.log(oneDog);
                            if (oneDog.name.toLowerCase() === dogName.toLowerCase()){
                                //dogRef.delete();
                                await dogRef.update({
                                    win: firebase.firestore.FieldValue.increment(1)
                                })
                                var dogData = await dogRef.get();
                                resolve(dogData.data());
                            }
                            
                        }
                        reject("no dog found")

                    //successCallback(dogsArr);
                }
                else{
                    // failureCallback("no such user found")
                    reject("no such user found")
                }
            }
            else{
                // failureCallback("no such user found")
                reject("no such user found")
                // failureCallback("no such user found")
            }
        }
    })
    
    promise.then((dogValue)=>{
        successCallback(dogValue);
    }).catch((err)=>{
        failureCallback(err);
    })

    }).catch((err)=>{
        failureCallback(err);
    })
}


async function updateDogLoss(email, dogName, successCallback, failureCallback){
    
    firebaseAdmin.auth().getUserByEmail(email).then(async (user) => {

        const customToken = await firebaseAdmin.auth().createCustomToken(user.uid);
        await firebase.auth().signInWithCustomToken(customToken);
        const db = firebase.firestore();
        var promise = new Promise(async(resolve, reject)=>{
        const userDoc = await db.collection('users').where("email", "==", email).get();

        for (const doc of userDoc.docs) {
            if (doc){
                var data = doc.data();
                if (data.email === email){

                    var kennelRef = data.kennel;
                        var kennelDoc = await kennelRef.get();
                        var kennelData = kennelDoc.data();
                        var dogs = kennelData.dogs;
                        for (const dogRef of dogs){
                            var dogData = await dogRef.get();
                        
                            var oneDog = dogData.data();
                            console.log(oneDog);
                            if (oneDog.name.toLowerCase() === dogName.toLowerCase()){
                                //dogRef.delete();
                                await dogRef.update({
                                    losses: firebase.firestore.FieldValue.increment(1)
                                })
                                var dogData = await dogRef.get();
                                resolve(dogData.data());
                            }
                            
                        }
                        reject("no dog found")

                    //successCallback(dogsArr);
                }
                else{
                    // failureCallback("no such user found")
                    reject("no such user found")
                }
            }
            else{
                // failureCallback("no such user found")
                reject("no such user found")
                // failureCallback("no such user found")
            }
        }
    })
    
    promise.then((dogValue)=>{
        successCallback(dogValue);
    }).catch((err)=>{
        failureCallback(err);
    })

    }).catch((err)=>{
        failureCallback(err);
    })
}



module.exports = {
    storeKennelData: storeKennelData,
    updateKennelDogs: updateKennelDogs,
    deleteKennelDogs: deleteKennelDogs,
    getAllDogs: getAllDogs,
    updateDogWin: updateDogWin,
    updateDogLoss: updateDogLoss
}