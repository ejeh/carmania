// Author: Godfrey Ejeh
// Date : 16/05/2018 

'use strict';

const    mongoose = require('mongoose'),
         uniqueValidator = require('mongoose-beautiful-unique-validation');

//=============================================================================
/**
 * vehicle Schema
 */
//=============================================================================
const VehiclesSchema = mongoose.Schema({
    vin: {
        type: String,
        required: [true, 'Please enter your vehicle identification number'],
        unique: "({VALUE}) already exists",
        minlength: 11
    },  
    model: {
        type: String,
        required: [true, 'Please enter your car model'],      
        
    },

    OBDnumber: {
        type: String,
        unique: "({VALUE}) already exists",
        required: [true, 'Please enter your ODB-II sim number'],
        maxlength: 11,
        minlength: 11

    }, 
    plate_number: {
        type: String,
        unique:"({VALUE}) already exist",
        required:[true, "Please enter your car plate number" ]
    },
    email: {
        type: String,
    }

    
},{timestamps: true}).plugin(uniqueValidator);


//=============================================================================
/**
 * Compile to Model
 */
//=============================================================================
const VehiclesModel = mongoose.model('Vehicles', VehiclesSchema);
//=============================================================================
/**
 * Export vehicleModel
 */
//=============================================================================
module.exports = VehiclesModel;
//=============================================================================