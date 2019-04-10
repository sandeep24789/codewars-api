var mongoose = require('mongoose');
var {ObjectID} = require('mongodb');
var Schema =  mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var RoundSchema = new Schema({
    quizohilic: {
        java: {
            question_ids: [
                ObjectId
            ]
        },
        dotnet : {
            question_ids : [ 
                ObjectId
            ]
        },
        python : {
            question_ids : [ 
                ObjectId
            ]
        }
    },
    codingame: {
        java: {
            question_ids: [
                ObjectId
            ]
        },
        dotnet : {
            question_ids : [ 
                ObjectId
            ]
        },
        python : {
            question_ids : [ 
                ObjectId
            ]
        }
    }
})

var Round = mongoose.model('rounds',RoundSchema);

module.exports = {Round};