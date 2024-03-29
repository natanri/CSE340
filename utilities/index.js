const invModel = require('../models/inventory-model')
const Util = {}
const jwt = require('jsonwebtoken')
require('dotenv').config()

/* ************************
 *Constructs the nav HTML unordered list
 * ************************ */
Util.getNav = async function (req, res, next){
    //console.log(data)
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li> <a href="/" title="Home page">Home</a> </li> '
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' + 
            row.classification_id +
            ' " title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' + 
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ************************
 *Constructs the dropdown 
 * ************************ */
 Util.  getDropDown = async function (classification_id = null){
  //console.log(data)
  let data = await invModel.getClassifications()
  let list = `<select name="classification_id" id="classification_id" required>`
  list += `<option value="">Choose a Classification</option>`
  data.rows.forEach((row) => {
      list += `<option value=${row.classification_id}`
       
      if(classification_id != null && row.classification_id == classification_id){
        list+= " selected "
        isSelected=""}
      list += `>${row.classification_name}</option>`
  })
  list += "</select>"
  return list
}

/* *********************************
* Build the classification view HTML
* ************ *********************/
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + ' " title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        + ' " alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' on CSE Motors" /></a>'
        grid += ' <div class="namePrice">'
        grid += ' <hr/>'
        grid += ' <h4>'
        grid += ' <a href="../../inv/detail/' + vehicle.inv_id + ' " title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h4>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* ****************************************
  *Create detail view
  *
  * ****************************************/
  Util.buildInventoryDetailGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<div id="inv-display2">' 
      data.forEach(vehicle => { 
        grid += '<h1>' + ' ' + vehicle.inv_year +' ' + vehicle.inv_make + ' ' + ' ' + vehicle.inv_model + '</h1>'        
        grid += '<a href="../../detail' + vehicle.inv_id + '">' + '' + '<img src="' + vehicle.inv_image + '" class="image"/>' + '</a>'
        grid += '<div class="info">'
        grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + 'Detail' + '</h2>'
        grid += '<h4><b><span> Price:$' + ' ' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></b><br></h4>'
        grid += '<p id="description"><b> Description: </b>' + ''
        + vehicle.inv_description  + '<br></p>' 
        grid += '<h4><b> <span> Color:</b> ' 
        + vehicle.inv_color + '</span><br></h4>'
        grid += '<h4><b> <span>  Miles:</b> ' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span><br></h4></div>'        
      })
      grid += '</div>'
      
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /**************************************** 
  *Middleware For Handling Errors
  *Wrap other function in this for
  *General Error Handling
  ****************************************/


 /************************************
  * Middleware to check token validity
  ************************************/
 Util.checkJWTToken = (req, res, next) => {
  if(req.cookies.jwt){
    jwt.verify(
      req.cookies.jwt, 
      process.env.ACCESS_TOKEN_SECRET, 
      function(err, accountData){
        if(err){
          req.flash('Please log in')
          res.clearCookie('jwt')
          return res.redirect('/account/login')
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
    }else {
      next()
    }
  }

    /****************
   * Check Login
   ****************/
    Util.checkLogin = (req, res, next) => {
      if(res.locals.loggedin){
        next()
      }else {
        req.flash("notices", "Please log in.")
        return res.redirect('/account/login/')
      }
    } 

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util