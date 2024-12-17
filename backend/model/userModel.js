const mongoose = require('mongoose');

const userShema = mongoose.Schema({
    email : {
        type : String,
        required: true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    lastLogin : {
        type : Date,
        default : Date.now
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : String,
    resetPasswordExpiresAt : Date,
    verificationToken : String,
    verificationTokenExpiresAt : Date, 
},
{
    timesamps: true

});

module.exports = mongoose.model('User', userShema)