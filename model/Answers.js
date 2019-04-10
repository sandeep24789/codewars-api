var mongoose = require('mongoose');
var { ObjectID } = require('mongodb');

var AnswersSchema = new mongoose.Schema({
    userId: ObjectID,
    score: Number,
    qa: [
     {
        questionid: ObjectID,
        credit: String,
        round: String,
        selected: String
    }]
})

var Answers = mongoose.model('answers',AnswersSchema);

module.exports={Answers};