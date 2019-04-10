var express = require('express');
var bodyParser = require('body-parser');
var { Answers } = require('../model/Answers');
var { Questions } = require('../model/Questions');
var { User } = require('../model/User');
var { ObjectID } = require('mongodb');


var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (req, res) => {
    //var body = req.body;

    //answers.save().then((answer) => {
    //res.status(200).send("persisted");
    var questionID = req.body.questionid;
    var option = req.body.option;
    var userID = req.body.userid;
    var round = req.body.round;
    //var id = answer._id;
    console.log(`${questionID} and ${option}`);
    Questions.findById(questionID).then((question) => {
        var correctOption = question.correct_option;
        console.log(correctOption);
        if (option === correctOption) {
            var credit = '1';
            var answers = new Answers({
                userId: req.body.userid,
                score: 1,
                qa: [
                    {
                        questionid: questionID,
                        credit: credit,
                        round: round,
                        selected: option
                    }
                ]
            })
            Answers.findOne({ userId: userID }).then((user) => {
                if (user) {
                    var id = user._id;
                    let qa = user.qa;
                    let score = user.score;
                    var updatedScore;
                    console.log(`${score} and ${updatedScore}`);
                    let questionIdCheckElement = qa.find(element => element.questionid.equals(questionID));
                    //console.log(questionIdCheckElement);
                    let filterRest = qa.filter(element => !element.questionid.equals(questionID));
                    console.log(filterRest);
                    let body = {
                        questionid: questionID,
                        credit: credit,
                        round: round,
                        selected: option
                    };

                    if (questionIdCheckElement) {
                        if (questionIdCheckElement.credit === '0') {
                            console.log('exist');
                            questionIdCheckElement.credit = 1;
                            filterRest.push(questionIdCheckElement);
                            updatedScore = score + 1;
                            console.log(filterRest);
                        } else {
                            filterRest.push(questionIdCheckElement);
                            updatedScore = score;
                        }
                    } else {
                        console.log('not exist');
                        filterRest.push(body);
                        updatedScore = score + 1;
                        console.log(body);
                    }

                    Answers.update({ "_id": id }, { $set: { score:updatedScore, qa: filterRest } }).then((doc) => {
                        console.log(doc);
                        res.status(200).send(doc);
                    })
                } else {
                    answers.save().then((doc) => {
                        res.status(200).send(doc);
                    })
                }
            })
        } else {
            var credit = '0';
            var answers = new Answers({
                userId: req.body.userid,
                score: 0,
                qa: [
                    {
                        questionid: questionID,
                        credit: credit,
                        round: round,
                        selected: option
                    }
                ]
            })
            Answers.findOne({ userId: userID }).then((user) => {
                if (user) {
                    var id = user._id;
                    var qa = user.qa;
                    let score = user.score;
                    var updatedScore;
                    let questionIdCheckElement = qa.find(element => element.questionid.equals(questionID));
                    //console.log(questionIdCheckElement);
                    let filterRest = qa.filter(element => !element.questionid.equals(questionID));
                    console.log(filterRest);
                    let body = {
                        questionid: questionID,
                        credit: credit,
                        round: round,
                        selected: option
                    };

                    if (questionIdCheckElement) {
                        if (questionIdCheckElement.credit === '1') {
                            console.log('exist');
                            questionIdCheckElement.credit = 0;
                            filterRest.push(questionIdCheckElement);
                            updatedScore = score === 0?score:score-1;
                            console.log(filterRest);
                        } else {
                            filterRest.push(questionIdCheckElement);
                            updatedScore = score;
                        }
                    } else {
                        console.log('not exist');
                        filterRest.push(body);
                        updatedScore = score === 0?score:score-1;
                        console.log(body);
                    }

                    Answers.update({ "_id": id }, { $set: {score:updatedScore, qa: filterRest } }).then((doc) => {
                        console.log(doc);
                        res.status(200).send(doc);
                    })
                } else {
                    answers.save().then((doc) => {
                        res.status(200).send(doc);
                    })
                }
            })
        }
    })
})

module.exports = router;