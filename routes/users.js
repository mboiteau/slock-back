var express = require('express');
var bodyParser = require('body-parser')
const User = require("../database/Schemas/UserSchema");
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: false})

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }  //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
            if (err) {
                return next(err)
            } else {
                return res.json({
                    success: true,
                    message: 'Utilisateur créé'
                })
            }
        });
    }
})

router.post('/login', function (req, res, next) {
    if (req.body.email &&
        req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.json({
                    success: true,
                    message: 'Utilisateur connecté'
                })
            }
        })
    }
})

module.exports = router;
