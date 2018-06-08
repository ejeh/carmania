'use strict';

/*********************************************************
 Authors:               Godfrey Ejeh, Swam Didam Bobby 
 Client:                CARMANIA APP TSS Induction
 Year:                  2018
 File Discription:      Routing processes
/********************************************************/

/**
 * Dependencies
*/

const
    express  = require('express'),
    log      = require('../utils/logger').getLogger('routes'),
           _ = require('lodash'),
    bcrypt   = require('bcryptjs'),
    crypto   = require('crypto'),
    mongoose = require('mongoose'),
    request  = require('request'),
    User     = require('../models/User'),
    vehicle  = require('../models/utils/vehicleUtils');


/**
 * Router instance
*/

const router = express.Router();


// GET /error-codes/:id

//============================================================================================
// User signup, login, find ...
//============================================================================================

/*
    to create a new user pass ---- {email, password}
*/

router.post("/CreateUser", function (req, res) {
    return User.create(req.body)
        .then(doc => {
            return res.status(200).json({ message: "User created", doc: doc });
        })
        .catch(err => {
            return res.status(500).json({ message: "Could not create user", err: err });

        })

});

//=============================================================================================
// User login router
//=============================================================================================


router.post('/loginUser', (req, res) => {

    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password)
            .then(user => {
                return res.json({ status: 200, message: "Welcome back to home page" });
            })
            .catch(err => {
                return res.json({ status: 500, message: "An error occured please check your credentials again", err: err });
            })
    }
    else {
        return res.status(400).json({info:"Both email and password are required"});
    }


})

//=============================================================================================
//Updating an existing user
//=============================================================================================

router.put('/updateUser', (req, res) => {
    return User.update({ "email": req.body.email },
        { $set: req.body })
        .then(doc => {
            log.info("Successfully updated user's details");
            return res.status(200).json({message: "user's detail update", doc: doc});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ message: "Unfurtunately an error has occured" });

        });
});


//=============================================================================================
// Search all registered users
//=============================================================================================

router.get("/viewAllUsers", function (req, res) {
    return User.find({})
        .then(doc => {
            return res.status(200).json({message: "User created",doc:doc});
        })
        .catch(err => {
            return res.status(500).json({message: "Cannot display list", err: err});
        })
      
  });

  //===========================================================================================
  //To collect OBD error code from virtual port
  //===========================================================================================

  router.post('/obdCodes', (req, res) => {
    var vin = req.body.vin;
    request.get({
        url: 'https://virtual-port.herokuapp.com/virtualport/geterror/' + vin,
        // qs: {
        //     vin: req.param.vin,

        // },
        headers: { accept: 'application/json' }


    },
        (error, body) => {
            if (error) {
                return res.json({status:500, message:"an error has occured", err:err});
            }
            if(!body.length) {
                return res.json({status:200, message:"No error code at this moment"});
            }
            else{
                return res.json({status:200, body: body.body});
            }

        }
    )

});

// GET / error-codes/:id
// This endpoint returns a description of an error code in English or German, 
// based on the error code id and the first 11 digits of the VIN (Vehicle Identification Number) of a car.
// The VIN is necessary in order to determine the maker of the car, 
// so that maker-specific error codes can be translated.
router.get('/error-codes/:id', (req, res) => {
    return vehicle.findById({ _id: req.params.id }, (err, data) => {
        if (err) {
            console.log(err);
           return res.json({ status: 500, message: "An error occurred" });
        }
        if (!data) {
            console.log('not available');
           return res.json({
                status: 200,
                message: "not available"
            });
        }
        else {
            request.get({
                url: 'https://api.eu.apiconnect.ibmcloud.com/hella-ventures-car-diagnostic-api/api/v1/dtc',
                qs:
                    {
                        client_id: '58b83a18-acce-4f72-9037-e38a5b96373f',
                        client_secret: 'aG2wV4gY5dU2iD3xI4qR5hU7yO3lA7mM1rR5kW1nM4dH0dO4sL',
                        vin: req.param("vin"),
                        code_id: req.param("code_id"),
                        language: req.param("language")
                    },
                headers: { accept: 'application/json' }


            },
                (error, response, body) => {
                    if (error) return console.error('Failed: %s', error.message);
                    res.json({
                        staus: 200,
                        message: body
                    });
                    console.log('success', body);

                }
            );
        }

    });

});

// //GET /vehicle-details/:id
// //This endpoint returns vehicle details(maker, country, year, plant) based on the VIN of the car
router.get('/vehicle-details/:id', (req, res) => {
    return vehicle.findById({ _id: req.params.id }, (err, data) => {
        if (err) {
            connsole.log(err);
            return res.json({ status: 500, message: "An error occurred" });
        }
        if (!data) {
            console.log('not available');
            return res.json({
                status: 400,
                message: "not available"
            });
        }
        else {
            request.get({
                url: 'https://api.eu.apiconnect.ibmcloud.com/hella-ventures-car-diagnostic-api/api/v1/vin',
                qs:
                    {
                        client_id: '58b83a18-acce-4f72-9037-e38a5b96373f',

                        client_secret: 'aG2wV4gY5dU2iD3xI4qR5hU7yO3lA7mM1rR5kW1nM4dH0dO4sL',

                        vin: req.param("vin")
                    },
                headers: { accept: 'application/json' }
            },
                (error, response, body) => {
                    if (error) return console.error('Failed: %s', error.message);
                    res.json({
                        status: 200,
                        message: body
                    });
                    console.log('Success: ', body);
                }
            );
        }
    });
});

// GET /all-car-makers
// This endpoint returns a list of all car markers that are supported by the API
router.get('/all-car-makers', (req, res) => {
    request.get({
        url: 'https://api.eu.apiconnect.ibmcloud.com/hella-ventures-car-diagnostic-api/api/v1/dtc/maker',
        qs: {
            client_id: '58b83a18-acce-4f72-9037-e38a5b96373f',
            client_secret: 'aG2wV4gY5dU2iD3xI4qR5hU7yO3lA7mM1rR5kW1nM4dH0dO4sL'
        },
        headers: { accept: 'application/json' }
    },
        (error, response, body) => {
            if (error) return console.error('Failed: %s', error.message);
            res.json({
                status: 200,
                message: body
            });
            console.log('Success: ', body);
        });

});

// // GET /all-langs
// // This endpoint returns all supported languages by the API
router.get('/all-langs', (req, res) => {
    request.get({
        url: 'https://api.eu.apiconnect.ibmcloud.com/hella-ventures-car-diagnostic-api/api/v1/dtc/langs',
        qs:
            {
                client_id: '58b83a18-acce-4f72-9037-e38a5b96373f',

                client_secret: 'aG2wV4gY5dU2iD3xI4qR5hU7yO3lA7mM1rR5kW1nM4dH0dO4sL'

            },
        headers: { accept: 'application/json' }
    },
        (error, response, body) => {
            if (error) return console.error('Failed: %s', error.message);
            res.json({
                status: 200,
                message: body
            });
            console.log('Success: ', body);
        });

});

// CreateVehicle - create a Vehicle

router.post('/createVehicle', (req, res) => {
    return vehicle.createVehicle(req.body)
        .then(doc => {
            log.info("Successfully created a vehicle");
            return res.status(200).json({
                status: 200,
                message: "vehicle created",
                doc: doc
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({
                status: 400,
                message: "Duplicate keys",
                err: err
            });
        });
});

// updateVehivle -- To update a vehicle

router.put('/updateVehicle', (req, res) => {
    return vehicle.updateVehicle(req.body.filter, req.body.update)
        .then(doc => {
            log.info("Successfully updated vehicle details")
            return res.status(200).json({
                status: 200,
                message: "Successfully updated vehicle details",
                doc: doc
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({
                status: 400,
                message: "Vehicle not found",
                err: err
            });


        });
});

// deleteVehicle -- Meant to delete a vehicle

router.delete('/deleteVehicle', (req, res) => {
    return vehicle.deleteVehicle(req.body)
        .then(doc => {
            log.info("Successfully deleted a vehicle");
            return res.status(200).json({
                status: 200,
                message: "vehicle deleted",
                doc: doc
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({
                status: 400,
                message: "Vehicle not found",
                err: err
            });
        });
});

//Vehicle -- Meant to get a registered vehicle

router.post('/getVehicle', (req, res) => {
    return vehicle.getVehicle(req.body)
        .then(doc => {
            log.info("Successfully got a vehicle");
            return res.status(200).json({ status: 200, doc: doc });
        })
        .catch(err => {
            return res.status(400).json({
                status: 400,
                message: "Sorry an error has occured",
                err: err
            });
        });
});

//allVehicle -- Meant to get all registered vehicles

router.post('/getAllVehicles', (req, res) => {
    return vehicle.getAllVehicles(req.body)
        .then(doc => {
            log.info("Successfully got all info");
            return res.status(200).json({ status: 200, doc: doc });
        })
        .catch(err => {
            return res.status(400).json({
                status: 400,
                message: "Sorry an error has occured",
                err: err
            });
        });
});
//=============================================================================
/**
* Module export
*/
//=============================================================================
module.exports = router;


