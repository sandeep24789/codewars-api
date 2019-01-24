var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    status: String,
    role: String,
    groups: String,
    rounds: {
        round1: {
            status: String,
            mark: String,
            result: String
        },
        round2: {
            status: String,
            mark: String,
            result: String
        },
        round3: {
            status: String,
            mark: String,
            result: String
        }
    },
    tickets: {
        ticket1: {
            yellow: String,
            bronze: String
        },
        ticket2: {
            blue: String,
            silver: String
        },
        ticket3: {
            green: String,
            gold: String
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

UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        } 
        return new Promise((resolve,reject)=> {
            bcrypt.compare(password,user.password, (err,res)=> {
                if(res) {
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