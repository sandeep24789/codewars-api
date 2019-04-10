var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcryptjs');
var { ObjectID } = require('mongodb');
var Schema =  mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    group: String,
    rounds: {
        quizohilic: {
            status: String,
            score: String,
            result: String,
            qa: [{
                questionid: ObjectId,
                credit: Number
            }]
        },
        codingame: {
            status: String,
            score: String,
            result: String,
            qa: [{
                questionid: ObjectId,
                credit: Number
            }]
        },
        cfc: {
            status: String,
            score: String,
            result: String
        }
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = config.secret;
    var token = jwt.sign({ _id: user._id.toHexString() }, access).toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findUser = function (userID) {
    var user = this;
    
    return user.findById(userID).then((user) => {
        return user;
    });
};

UserSchema.statics.trackAnswers = function (userID, updateQuery) {
    var user = this;
    console.log(updateQuery);
    return user.update({ _id: userID }, updateQuery, { new: true }).then((doc) => {
        return doc;
    })
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    })
}

var User = mongoose.model('User', UserSchema);

module.exports = { User };