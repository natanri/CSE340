/*************************************
 * Account controller
 * Unit 4, deliver login view activity
 *************************************/
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
/***********************
 * Deliver login view
 **********************/
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
    })
}

/************************
 * Deliver register view
 ************************/
async function buildRegister(req, res, next){
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Register',
        nav,
        errors: null
    })
}

/**********************
 * Process Registration
 **********************/
async function registerAccount(req, res){
    let nav = await utilities.getNav()
    const {
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password 
    } = req.body

    //Hash the password before storing
    let hashedPassword
    try{
        //regular password and cost (salt os generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    }catch(error){
        req.flash('notice', 'Sorry, there was an error processing the registration.')
        req.status(500).render('account/register', {
            title: 'Registration Error',
            nav,
            errors: null
        })        
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    if(regResult){
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`  
        )
        res.status(201).render("account/login", {
            title: 'Login',
            nav,
            errors: null
        })
    } else {
        req.flash('notice', 'Sorry, the registration failed.')
        req.status(501).render('account/register',{
            title: 'Registration',
            nav,
            errors: null
        })
    }
}


/************************
 * Management login view
 ************************/
async function managementLogin(req, res, next) {
    try{
        let nav = await utilities.getNav()
        console.log('management-login')
        res.render('./account/management-login',{
            title: 'Account Management',
            nav,
            errors: null
        })
    }catch(error){
        console.error('Management Login: ' + error)
        /*res.render('errors/error', {
            title: 'Server Error',
            message: 'There was an error.',
            nav: await utilities.getNav(),
        })*/
        next(error)
    }
}


/************************
 * Process login request
 ***********************/
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("/account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        return res.redirect("/account/")
        }
       } catch (error) {
        return new Error('Access Forbidden')
       }
    }
    

   

module.exports = {buildLogin, buildRegister, registerAccount, managementLogin, accountLogin}

