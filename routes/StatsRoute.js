var express = require('express');
var router = express.Router();
const {addMactch, removeMactch, addKennel, removeKennel, addChampion,
     removeChampion, addGrandChampion, removeGrandChampion, getAllStats} = require('../controllers/StatsController');

router.post('/game/add', (req, res) => {
    addMactch(function(){
        res.status(200).send({
            success: true,
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })

})

router.post('/game/remove', (req, res) =>{
    removeMactch(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/kennel/add', (req, res)=>{
    addKennel(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/kennel/remove', (req, res)=>{
    removeKennel(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/champion/add', (req, res)=>{
    addChampion(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/champion/remove', (req, res)=>{
    removeChampion(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/grandChampion/add', (req, res)=>{
    addGrandChampion(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.post('/grandChampion/remove', (req, res)=>{
    removeGrandChampion(function(){
        res.status(200).send({
            success: true
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

router.get('/all', (req, res)=>{
    getAllStats(function(data){
        res.status(200).send({
            success: true,
            data: data
        })
    }, function(error){
        res.status(400).send({
            success: false,
            error: error
        })
    })
})

module.exports = router;

