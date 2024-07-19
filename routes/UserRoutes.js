var express = require('express');
var router = express.Router();
var KennelHandler = require('../models/KennelHandler').KennelHandler;
var Dog = require('../models/Dog').Dog;
const {getAllUserData} = require('../controllers/FirebaseAuthentication');

router.post('/get', (req, res) => {
    var data = req.body;

    getAllUserData(data.email, function (arr) {
        // res.status(200).send({
        //     success: true,
        //     "userObj": {
        //         usernames: arr
        //     }
        // })
        res.status(200).send(arr);
    }, function (err) {
        res.status(400).send({
            success: false,
            error: err
        })
    })
})


module.exports = router;