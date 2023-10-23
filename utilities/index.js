const invModel = require('../models/inventory-model')
const Util = {}

/* ************************
 *Constructs the nav HTML unordered list
 * ************************ */
Util.getNav = async function (req, res, next){
    //console.log(data)
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home<a/></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' + 
            row.classification_id +
            '"title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' + 
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "<ul>"
    return list
}

module.exports = Util;

/* **************
* Build the classification view HTML
* ************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h4>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
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
  /*Util.buildInventoryDetailGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<h1>' + ' ' + vehicle.inv_year +' ' + vehicle.inv_make + ' ' + ' ' + vehicle.inv_model + '</h1>'        
        grid += '<a href="../../inv/detail/' + ' ' + vehicle.inv_image + '</a>'
        grid += '<p>'
        grid += '<h2' + '  ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + 'Detail' + '</h2'
        grid += 'Price$: ' + ' ' + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
        grid += '<b>Details: ' + vehicle.inv_description
        grid += '<b>Color: ' + vehicle.inv_color
        grid += '<b>Miles: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
        grid += '</p>'
      })
      
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }*/

  /* *************************************** 
  * Middleware For Handling Errors
  *Wrap other function in this for
  *General Error Handling
  *************************************** */
 Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
  
  module.exports = Util