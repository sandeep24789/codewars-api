var mongoose = require('mongoose');

var QuestionsSchema = new mongoose.Schema({
    question: String,
    options: {
        a: String,
        b: String,
        c: String,
        d: String
    },
    correct_option: String
})

var Questions = mongoose.model('questions',QuestionsSchema);

module.exports = {Questions};