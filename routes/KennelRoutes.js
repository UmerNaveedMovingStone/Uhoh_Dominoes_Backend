var express = require('express');
var router = express.Router();
var KennelHandler = require('../models/KennelHandler').KennelHandler;
var Dog = require('../models/Dog').Dog;
const {storeKennelData, updateKennelDogs, deleteKennelDogs, getAllDogs, updateDogWin, updateDogLoss} = require('../controllers/DataController/KennelController');
const {getBalance} = require('../controllers/FirebaseAuthentication');
router.post('/set/kennel', (req, res) => {
    var data = req.body;
    var dogs = [];
    for (const dog of data.dogs){
        dogs.push(new Dog(dog.name, dog.sex, dog.sire, dog.dam, dog.ear,
            dog.color, dog.win, dog.losses, dog.bite, dog.stamina, dog.gameness, dog.seed))
    }
    var kennel = new KennelHandler(data.name, data.location, data.skinName, dogs);
    storeKennelData(kennel, data.email, function () {
        res.status(200).send({
            success: true,
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            error: error
        })
    })

})


router.post('/update/kennel', (req, res)=>{
    // var data = req.body;

    // var dogs = [];
    // for (const dog of data.dogs){
    //     dogs.push(new Dog(dog.name, dog.sex, dog.sire, dog.dam, dog.ear,
    //         dog.color, dog.win, dog.losses, dog.bite, dog.stamina, dog.gameness, dog.seed))
    // }

    // updateKennelDogs(data.email, dogs, function(){
    //     res.status(200).send({
    //         success: true,
    //     })
    // }, function (error) {
    //     res.status(400).send({
    //         success: false,
    //         error: error
    //     })
    // })

    var data = req.body;
    console.log(req.body);
    var dogData = data.dog;
    var dog = new Dog(dogData.name, dogData.sex, dogData.sire, dogData.dam, dogData.ear,
        dogData.color, dogData.win, dogData.losses, dogData.bite, dogData.stamina, dogData.gameness, dogData.seed);
    

    updateKennelDogs(data.email, dog, function(val){
        res.status(200).send({
            success: true,
            balance: val
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            error: error
        })
    })

})


router.post('/delete/kennel', (req, res)=>{
    var email = req.body.email;
    var dogName = req.body.dogName;
    console.log(req.body);

    deleteKennelDogs(email, dogName, function () {
        res.status(200).send({
            success: true,
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            error: error
        })
    })

})

router.post('/dogs/all', (req, res)=>{
    var email = req.body.email;
    getAllDogs(email, (dogs)=>{
        console.log(dogs);
        res.status(200).send({
            success: true,
            dogs: dogs
        })

    }, (err)=>{
        res.status(400).send({
            success: false,
            error: err
        })
    })

})

router.post('/dogs/win', (req, res)=>{
    var email = req.body.email
    var dogName = req.body.dogName
    console.log(req.body)
    updateDogWin(email, dogName, (dog)=>{
        res.status(200).send({
            success: true,
            dogs: dog
        })
    }, (err)=>{
        res.status(400).send({
            success: false,
            error: err
        })
    })
})

router.post('/dogs/loss', (req, res)=>{
    var email = req.body.email
    var dogName = req.body.dogName
    console.log(req.body)
    updateDogLoss(email, dogName, (dog)=>{
        res.status(200).send({
            success: true,
            dogs: dog
        })
    }, (err)=>{
        res.status(400).send({
            success: false,
            error: err
        })
    })
})


router.get('/balance', (req, res)=>{
    var email = req.query.email
    
    console.log(req.query.email)
    getBalance(email, (userData)=>{
        res.status(200).send({
            success: true,
            balance: userData
        })
    }, (err)=>{
        res.status(400).send({
            success: false,
            error: err
        })
    });
})


module.exports = router;

