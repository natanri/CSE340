/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const cookieParser = require('cookie-parser')
const inventoryRoute = require('./routes/inventoryRoute')
const baseController = require('./controllers/baseController')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require('./utilities/')
const session = require('express-session')
const pool = require('./database/')
const bodyParser = require('body-parser')





/*****************************
 * Middleware
 *****************************/
app.use(session({
  store: new(require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

//Express messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/**************
 * Body parser
 **************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true})) // for parsing application/x-www-form-urlencoded
//Unit 5, Login activity
app.use(cookieParser())
//Unit 5, Login process activity
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', './layouts/layout')

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
app.get('/', utilities.handleErrors(baseController.buildHome))

//inventory routes
app.use("/inv", inventoryRoute)

//Route to build login view
app.use('/account', require('./routes/accountRoute'))

//File Not Found Route - must be last route in list
app.use(async(req, res, next) => {
  next({status: 404, message: 'LIKE UNICORNS, THIS PAGE DOES NOT EXIST... OR AT LEAST NOT ANYMORE.'})
})

/* *****************************
* Express Error Handler
* Place after al other middleware 
* *******************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = "Oh no, There was a crash. Maybe try a different route?"}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
