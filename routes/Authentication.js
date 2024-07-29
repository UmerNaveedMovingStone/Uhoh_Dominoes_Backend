var express = require('express');
var router = express.Router();

const {signup, login, resendVerificationEmail, logoutUser, forgotPassword, deleteuser} = require('../controllers/FirebaseAuthentication');

router.get('/resendEmail', function(req, res, next) {
    var email = req.query.email;
    resendVerificationEmail(email, function () {
        res.status(200).send({
            success: true
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            error: error
        })
    })
});

router.post('/login', (req, res) => {
    var user = req.body;
    login(user, function(userCredentials, kennelName){
        res.status(200).send({
            success: true,
            userObj: userCredentials.user,
            kennel: kennelName
        })
    }, function(error){
        res.status(400).send({
            success: false,
            message: error
        })
    })
})

router.post('/signup', (req, res) => {
    var user = req.body

    signup(user,
        function(userCredentials) {
            res.status(200).send({
                success: true,
                userObj: userCredentials.user
            })
        }, function(error){
            res.status(400).send({
                success: false,
                message: error.message
            })
    })
})

router.post('/logout', (req, res)=>{
    var user = req.body
    logoutUser(user.email, function () {
        res.status(200).send({
            success: true
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    })
})

router.post('/forgot', (req, res)=>{
    var user = req.body
    console.log(req.body)
    forgotPassword(user.email, function () {
        res.status(200).send({
            success: true
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    })
})

router.post('/deleteUser', (req, res)=>{
    var user = req.body
    console.log(req.body)
    deleteuser(user.email, function () {
        res.status(200).send({
            success: true
        })
    }, function (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    })
})



module.exports = router;
