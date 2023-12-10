// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const inv_validate = require('../utilities/inventory-validation')
const validate = require("../utilities/acount-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory by details view
router.get('/detail/:inv_id', invController.BuildByInventoryDetail)

//Route to add classification
router.get('/add-classification', utilities.handleErrors(invController.addnewClassificationView))

//Route to add item
router.get('/add-inventory', utilities.handleErrors(invController.addnewInventoryView))

//Route to management
router.get('/', utilities.handleErrors(invController.ManagementView))
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

//Route to editing inventory
router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView))

//Route post  "update vehicle"
router.post('/edit', validate.invRules(),
validate.)

//Route to edit classification
router.post('/add-classification', 
inv_validate.addClassificationRules(), 
inv_validate.checkClassData,
utilities.handleErrors(invController.addnewClassification))

//build registration on inventory
router.post('/add-inventory', inv_validate.InventoryRules(),
inv_validate.checkVehicleData, 
utilities.handleErrors(invController.addnewInventory))


module.exports = router;