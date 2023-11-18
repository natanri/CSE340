/*************************************
 * Account controller
 * Unit 4, deliver login view activity
 *************************************/
const bcrypt = require('bcryptjs')
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
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

module.exports = {buildLogin, buildRegister, registerAccount}

