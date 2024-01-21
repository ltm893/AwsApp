"use strict" ; 

const express = require('express');
const router = express.Router();

const setEnvTypeController = require('../controllers/setEnv') ; 

router.get('/envType/:envId',setEnvTypeController.setEnv) ;
router.get('/cogTest',setEnvTypeController.cogTest) ;
// router.get('/cogAuthCode',setEnvTypeController.cogAuthCode) ;
// router.get('/cogAuthToken',setEnvTypeController.cogAuthTest) ;

module.exports = router;