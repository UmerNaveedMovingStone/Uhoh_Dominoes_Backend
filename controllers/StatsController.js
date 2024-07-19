const firebase = require("firebase/app")
const FieldValue = require('firebase-admin').firestore.FieldValue;
const firestore = require("firebase-admin").firestore;

async function getAllStats(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.data() !== null){
        console.log(docRef.data())
        successCallback(docRef.data())
    }
    else{
        failureCallback("no data exists")
    }
}

async function addMactch(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            matchesPlayed: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            matchesPlayed: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
    
}

async function removeMactch(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            matchesPlayed: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            matchesPlayed: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
    
}

async function addKennel(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            kennelsCreated: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            kennelsCreated: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
}

async function removeKennel(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            kennelsCreated: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            kennelsCreated: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
}

async function addChampion(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            champions: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            champions: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
}

async function removeChampion(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            champions: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            champions: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
}

async function addGrandChampion(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            grandChampions: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            grandChampions: FieldValue.increment(1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
}

async function removeGrandChampion(successCallback, failureCallback){
    const db = firestore();
    const docRef = await db.collection('stats').doc('total').get();
    if (docRef.exists){
        console.log(docRef);
        docRef.ref.update({
            grandChampions: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
        
    }
    else{
        docRef.ref.set({
            grandChampions: FieldValue.increment(-1)
        }).then(()=>{
            successCallback();
        }).catch((err)=>{
            failureCallback(err);
        })
    }
}

module.exports = {
    addMactch: addMactch,
    removeMactch: removeMactch,
    addKennel: addKennel,
    removeKennel: removeKennel,
    addChampion: addChampion, 
    removeChampion: removeChampion,
    addGrandChampion: addGrandChampion,
    removeGrandChampion: removeGrandChampion,
    getAllStats: getAllStats
}