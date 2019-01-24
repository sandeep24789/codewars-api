var express = require('express');
var bodyParser = require('body-parser');
var {User} = require('../model/User');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.post('/',(req,res)=> {
    var user = new User({
        email:req.body.email,
        password:req.body.password,
        userName:req.body.userName,
        status:req.body.status,
        role:req.body.role
    });
    user.save().then((user)=>{
         res.status(200).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

router.get('/',(req,res)=>{
    User.find().then((users)=>{
        res.send({users});
    },(e)=>{
        res.status(400).send(e);
    })
})

module.exports=router;