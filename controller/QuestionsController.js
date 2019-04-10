var express = require('express');
var bodyParser = require('body-parser');
var {Questions} = require('../model/Questions');
var Binary = require('mongodb').Binary;
var fs = require('fs');
var _ = require('lodash');
var {CodingameQuestions} = require('../model/CodingameQuestions');
var mongoose = require('mongoose');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.get('/get',(req,res)=>{
    
    Questions.find().then((doc)=>{
        res.status(200).send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

router.get('/:id',(req,res)=>{
    var id = req.params.id;
    Questions.findById(id,{correct_option:0}).then((doc)=>{
        res.status(200).send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

router.post('/codingame',(req,res)=>{
    var body = _.pick(req.body,['filePath']);
    //console.log(body.filePath);
    var data = fs.readFileSync(body.filePath);
    console.log(data);
    var insertData = {};
    insertData.fileData = Binary(data);
    console.log(insertData.fileData);
    //var codingameQuestions = mongoose.collection('questions');
    // var codingameQuestions = new CodingameQuestions({
    //     question: insertData
    // })
    codingameQuestions.save().then(()=>{
        res.send('persisted');
    })
})

module.exports=router;