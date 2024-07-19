var express = require('express');
var router = express.Router();
const {postWager, acceptWager, endMatch, endWager} = require('../controllers/WagerController');



router.post('/post', (req, res)=>{
    
    var data = req.body;
    postWager(data.email, data.amount, function(data){
        res.status(200).send({
            success: true,
            balance: data
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
    
})

router.post('/accept', (req, res)=>{
    var data = req.body;
    acceptWager(data.hostEmail, data.userEmail, data.amount, function(data){
        res.status(200).send({
            success: true,
            balance: data
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/end', (req, res)=>{
    var data = req.body;
    endMatch(data.winEmail, data.hostEmail, data.loseEmail, data.amount, data.winDog, data.loseDog, function(data){
        res.status(200).send({
            success: true,
            msg: data
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/remove', (req, res)=>{
    var data = req.body;
    endWager(data.hostEmail, data.amount, function(balance){
        res.status(200).send({
            success: true,
            balance: balance
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

module.exports = router;

