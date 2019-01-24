var express = require('express');
var bodyParser = require('body-parser');
var { User } = require('../model/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var _ = require('lodash');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/register', (req, res) => {
    var hashedPwd = bcrypt.hashSync(req.body.password, 8);
    var user = new User({
        email: req.body.email,
        password: hashedPwd,
        name: req.body.name,
        status: req.body.status,
        role: req.body.role,
        groups: req.body.groups,
        rounds: {
            round1: {
                status: 'YET_TO_START',
                mark: 0,
                result: 'NA'
            },
            round2: {
                status: 'YET_TO_START',
                mark: 0,
                result: 'NA'
            },
            round3: {
                status: 'YET_TO_START',
                mark: 0,
                result: 'NA'
            }
        },
        tickets: {
            ticket1: {
                yellow: 'YET_TO_START',
                bronze: 'YET_TO_START'
            },
            ticket2: {
                blue: 'YET_TO_START',
                silver: 'YET_TO_START'
            },
            ticket3: {
                green: 'YET_TO_START',
                gold: 'YET_TO_START'
            }
        }
    });

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

router.post('/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
        })
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

module.exports = router;