var mongoose = require('mongoose');

var CodingameQuestionsSchema = new mongoose.Schema({
    question: String
})

var CodingameQuestions = mongoose.model('codingameQuestions',CodingameQuestionsSchema);

module.exports = {CodingameQuestions};