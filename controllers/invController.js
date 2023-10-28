const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  //console.log(data)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* *********************************************
* Get all inventory items for a given vehicle id
* *********************************************/
invCont.BuildByInventoryDetail = async function (req, res, next) {
  const inv_Id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_Id)
  //console.log(inv_Id)
  const grid = await utilities.buildInventoryDetailGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_model
  res.render("./inventory/detail", {
    title: className + " vehicle ",
    nav,
    grid,
  })
}


module.exports = invCont