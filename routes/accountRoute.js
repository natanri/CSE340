/***************************
 *Account routes
 *Unit 4, deliver login view activity 
 ***************************/
//Needed Resources
const express = require('express')
//This is how we name express.Router() function
const router = new express.Router()
//This is the account controller
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')

/************************
 * Deliver Login View
 ************************/
//Here we can handle errors from accountController
router.get('/login', utilities.handleErrors(accountController.buildLogin))

/************************
 * Deliver Registration View
 ************************/
router.get('/register', utilities.handleErrors(accountController.buildRegister))

/****************************
 * Deliver Registration View
 ***************************/
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router