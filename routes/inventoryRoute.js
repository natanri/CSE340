// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const inv_validate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route to build inventory by details view
router.get('/detail/:inv_id', invController.BuildByInventoryDetail);
//Route of management
router.get('/', utilities.handleErrors(invController.ManagementView))
//Route to add classification
router.get('/add-classification', utilities.handleErrors(invController.addnewClassificationView))
//Route to add item
router.get('/add-inventory', utilities.handleErrors(invController.addnewInventoryView))
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