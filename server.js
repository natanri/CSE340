/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
const inventoryRoute = require('./routes/inventoryRoute')
const baseController = require('./controllers/baseController')
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require('./utilities/')
//const detail = require('./views/errors')
//Require the inventoryRoute file

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

//inventory
app.use("/inv", inventoryRoute)
//View Detail
//app.use('/inv', detail)
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

