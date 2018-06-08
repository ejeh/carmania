 const
    express = require('express'),
    mongoose = require('mongoose');

    const errorSchema = new mongoose.Schema({
        vin:{
            type:String,
            required:true
        },
        errorCode:{
            type:String,
            required:true
        }
    })

    module.exports = mongoose.model('ErrorCode', errorSchema)