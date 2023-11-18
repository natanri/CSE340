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
const regValidate = require('../utilities/acount-validation')


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
router.post('/register', regValidate.registrationRules(), 
regValidate.checkRegData, 
utilities.handleErrors(accountController.registerAccount))

/***************************
 * Process the login attempt
 ***************************/
router.post('/login',
 (req, res) => { 
    res.status(200).send('login process')
})

module.exports = router