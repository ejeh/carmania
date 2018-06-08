
'use strict';

/*********************************************************
 Author:                Swam Didam Bobby 
 Client:                CARMANIA APP TSS Induction
 Year:                  2018
/********************************************************/

require('dotenv').config();



const
    express           	= require("express"),
    methodOverride    	= require("method-override"),
    log4js              = require('log4js'),
    compress          	= require("compression"),
    bodyParser          = require("body-parser"),
    cookieParser    	  = require("cookie-parser"),
    logger          	  = require("morgan"),
    mongoose          	= require("mongoose"),
    cors              	=require('cors'),
    log 		            = require('./utils/logger').getLogger('APP');

const app = express();


const
    port = process.env.PORT,
    env = process.env.NODE_ENV,
    DBURL = process.env.DBURL;
let db;


app.set('port', port);
app.set('env', env);
const routes = require('./routes/routes');


mongoose.Promise = require('bluebird');

var options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};

mongoose.connect(DBURL, options);
db = mongoose.connection;
db.on('error', err => {
  log.error('There was a db connection error');
});
db.once('connected', () => {
  log.info('Successfully connected to mongoDB');
});
db.once('disconnected', () => {
  log.error('Successfully disconnected from mongoDB');
});
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    log.error('dBase connection closed due to app termination');
    process.exit(0);
  });
});

app.use(log4js.connectLogger(log, { level: 'auto' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Header to permit cors calls
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requsted-With,Content-Type, Accept,Authorization');
  if(req.method === 'OPTIONS') {
      res.status(200).end();
  }
  else {
      next();
  }
});

app.get("/", (req, res) => {
    return res.status(200).json({info:"welcome to App home"});
})
app.use('/carmania', require('./routes/routes'));



//=============================================================================
module.exports = app;
//=============================================================================