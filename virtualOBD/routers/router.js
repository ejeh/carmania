const 
    ErrorCode = require('../models/error'),
    express = require('express'),
    router = express.Router();

    router.post('/createError', (req, res)=>{
        ErrorCode.create(req.body)
        .then(doc=>{
            return res.status(200).json(doc)
        })
        .catch(err=>{
            return res.status(500).json(err);
        })
    })

    router.get('/geterror/:vin', (req, res)=>{

        ErrorCode.find(req.body).select('-vin').select('-_id').select('-__v')
        .then(doc=>{
            return res.status(200).json(doc)
        })
        .catch(err=>{
            return res.status(500).json(err)
        })

    })

    module.exports = router
