'use strict'

/*********************************************************
 Author:                Swam Didam Bobby 
 Client:                CARMANIA APP TSS Induction
 Year:                  2018
 File Discription:      Model for end users
/********************************************************/

// model dependencies
const
    mongoose                = require("mongoose"),
    bcrypt                  = require('bcryptjs');


// MONGOOSE MODEL CONFIGURATION
const UserSchema = new mongoose.Schema({

    
    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password 6 digit minimum'],
        minlength:6
    },
    firstName: {
        type:String
    },
    lastName: {
        type:String
    },
    phone: {
        type:String
    },
    companyName: {
        type:String
    },
    repairsMaintenance: {
        type:String
    },
    performanceUpgrade: {
        type:String
    },
    safetySecurity: {
        type:String
    },

});

UserSchema.pre('save', function(next) {
    var User = this;
    bcrypt.hash(User.password, 10, function(err, hash) {
        if(err)
        {
            return next(err);
        }
        User.password = hash;
        next();
    })
})

UserSchema.statics.authenticate = function (email, password, callback){
    var User = this;
    User.findOne({ email: email}).exec(function (err, User) {
        if(err) {
            return callback(err);
        }
        if(!User) {
            var err = new Error('User not found');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, User.password, function(err, result) {
            if (result === true) {
                return callback(null, User);
            }
            else
            {
                return callback();
            }
            
        })
    })
}
module.exports = mongoose.model('User', UserSchema);


