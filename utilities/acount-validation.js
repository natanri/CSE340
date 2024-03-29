const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}
const accountModel = require('../models/account-model')

/************************************
 * Registration Data Validation Rules
 ************************************/
validate.registrationRules = () => {
    return [
    // FirstName is required and must be string
    body('account_firstname')
    .trim()
    .isLength({ min: 1})
    .withMessage('Please provide a first name.'),//on error this message is sent

    //Last Name is required and cannot already exist in the DB
    body('account_lastname')
    .trim()
    .isLength({ min: 2})
    .withMessage('Please provide a last name.'),//on error this message is sent

    //valid email is required and cannot already exist in the DB
    body('account_email')
    .trim()
    .isEmail()
    .normalizeEmail()//refer to validator.js docs
    .withMessage('A valid email is required.')
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if(emailExists){
            throw new Error("This Email Address is already registered. Please log in or use a different email")
        }
      }),

    //password is required and must be strong password
    body('account_password')
    .trim()
    .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
    ]
}

/********************************************************
 * Check data and return erros or continue to registration
 ********************************************************/
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/register', {
            errors,
            title: 'Register',
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next();
}

/*************
 * login rules
 *************/
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists) {
        throw new Error ("Email doesn't exists. Please register.")
      }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    ]
}

/*validate.loginRules = () => {
    return [
      // valid email is required and it has to exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (!emailExists){
            throw new Error("Email not registered. Please register using the link below")
          }
        }),
      
      // password is required and must be strong password
      body('account_password')
      .trim()
      .isStrongPassword({
        minLength: 10,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password incorrect')
    ]
  }*/

  validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('there is something wrong',errors)
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }
 /*validate.checkLoginData = async(req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        console.log('hay errores', errors)
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            account_email           
        })
      return
    }
    next()
}*/

module.exports = validate