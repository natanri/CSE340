/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
//Require the inventoryRoute file
const inventoryRoute = require('./routes/inventoryRoute');
const baseController = require('./controllers/baseController')



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
app.get('/', baseController.buildHome)// I have doubts about if I no mistaken this part or if it is in the right part 

//inventory
app.use("/inv", invetoryRoute)

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

