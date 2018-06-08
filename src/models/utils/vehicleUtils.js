'use strict'

const
    vehicle = require('../vehicle'),
    promise = require('bluebird'),
    // log = require ('utils/logger').getlogger('vehicleUtils'),
    _ = require('lodash');




exports.createVehicle = (doc) => {
    if (_.isEmpty(doc)) {
        return promise.reject("missing fields")
    }
    if (_.isArray(doc)) {
        return vehicle.insertMany(doc);
    }
    else {
        const newVehicle = new vehicle(doc)
        return newVehicle.save();
    }
}

//=============================================================================
/**
 * Delete User
 */
//=============================================================================
exports.deleteVehicle = (filter) => {
    if (_.isEmpty(filter)) {
        return Promise.reject("MissingFields");
    }

    return vehicle.deleteMany(filter)
        .then(result => {
            // result = JSON.parse(result);
            if (result.n == 0) {
                return Promise.reject("ResourceNotExist");
            }
            else if (result.n > 0) {
                return result;
            }
            else if (result.ok !== 1) {
                return Promise.reject("BadRequest");
            }
            else {
                log.error("Error cannot delete the resource " + JSON.stringify(result));
                return Promise.reject("UnknownError")
            }
        });
};

//=============================================================================
/**
 * get Vehicle
 */
//=============================================================================

exports.getVehicle = (filter) => {
    if (_.isEmpty(filter)) {
        return Promise.reject("MissingFields");
    }
    return vehicle.find(filter)
        .then(result => {
            if (!_.isEmpty(result)) {
                return result;
            }
            else {
                return false;
            }
        });
};
//=============================================================================
/**
 * Update a Vehicle
 */
//=============================================================================
exports.updateVehicle = (filter, update) => {
    if (_.isEmpty(filter) || _.isEmpty(update)) {
        return Promise.reject("Nothing to update");
    }
    return vehicle.updateMany(filter, update)
        .then(result => {
            if (result.ok != 1) {
                return Promise.reject("BadRequest");
            }
            else if (result.nModified >= 0) {
                return result;
            }
            else {
                log.error("Error cannot update the resource " + JSON.stringify(result));
                return Promise.reject('UnknownError')
            }
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

//=============================================================================
/**
 * get All Vehicles
 */
//=============================================================================

exports.getAllVehicles = (filter) => {
    return vehicle.find(filter)        
            if (!_.isEmpty(result)) {
                return result;
            }
            else {
                return false;
            }
        
};