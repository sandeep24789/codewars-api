var express = require('express');
var bodyParser = require('body-parser');
var { Round } = require('../model/Round');
var { User } = require('../model/User');
var _ = require('lodash');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/get', (req, res) => {

    Round.find().then((doc) => {
        res.status(200).send(doc);
    }).catch(e => {
        res.status(400).send(e);
    })
});

router.get('/:id/:round', (req, res) => {
    var id = req.params.id;
    var round = req.params.round;
    //console.log(round);

    User.findById(id, { group: 1 }).then((user) => {
        var group = user.group;
        var query = {};
        query[round+'.'+group] = 1;
        
        console.log(query);
        Round.findOne({}, query).then((doc) => {
            var result;
            
            if (group === 'java') {
                result = {
                    question_id: doc[round].java.question_ids
                }
            } else if (group === 'python') {
                result = {
                    question_id: doc[round].python.question_ids
                }
            } else if (group === 'dotnet') {
                result = {
                    question_id: doc[round].dotnet.question_ids
                }
            }
            var shuffledResult = _.shuffle(result.question_id);
            console.log('result::',result);
            console.log(shuffledResult);
            res.status(200).send(shuffledResult);
        }).catch((e) => {
            res.status(400).send(e);
        })
    }).catch((e) => {
        res.status(400).send(e);
    })

})


module.exports = router;