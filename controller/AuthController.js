var express = require('express');
var bodyParser = require('body-parser');
var { User } = require('../model/User');
var {ObjectID} = require('mongodb');

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
        group: req.body.group,
        rounds: {
            quizohilic: {
                status: 'ACTIVATE',
                mark: 0,
                result: 'NA'
            },
            codingame: {
                status: 'DEACTIVATTE',
                mark: 0,
                result: 'NA'
            },
            cfc: {
                status: 'DEACTIVATE',
                mark: 0,
                result: 'NA'
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
        console.log(user);
        return user.generateAuthToken().then((token)=>{
            var loginDetails = {
                email: user.email,
                name: user.name,
                id: user._id,
                quizohilic: user.rounds.quizohilic.status,
                codingame: user.rounds.codingame.status,
                cfc: user.rounds.cfc.status,
                group: user.group,
                token: token
            }
            res.header('x-auth', token).send(loginDetails);
        })
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

router.get('/logout',(req,res)=>{
    res.status(200).send({token:null});
})

router.patch('/update/:id',(req,res)=>{
    var id = req.params.id;
    var round = req.body.round;
    var status = req.body.status;

    var query = {};
    query['rounds.'+round+'.status'] = status;

    console.log(query);

    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    User.findByIdAndUpdate(id,{$set:query},{new:true}).then((user)=>{
        if(user)
            res.send({user})
        else
            res.status(404).send();
    }).catch(e=>{
        res.status(400).send(e);
    })
})


module.exports = router;