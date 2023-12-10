const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ****************************************
 *  Build inventory by classification view
 * *************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  //console.log(data)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  console.log(className)
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

/************************
 * Build Management view
 ***********************/
invCont.ManagementView = async function(req, res, next) {
  try{
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.getDropDown()
    res.render('./inventory/management',{

      title: 'Vehicle Management',
      nav,
      errors: null,
      classificationSelect,
    })    
  }catch(error){
    console.error(
      'An error occurred in inventoryController.ManagamentView:',
      error      
    )
    next(error)
  }
}
/***********************************
 * build an add-classification view
 ***********************************/
invCont.addnewClassificationView = async function(req, res, next){
  try{
    let nav = await utilities.getNav()
    res.render('./inventory/add-classification',{
      title:'Add Classification',
      nav,
      errors: null
    })  
  }catch(error){
    console.error(
      'Hi, sorry, I know you are working so hard, but this is not the route.'
    )
  }
}
/***********************************
 * build an add-Inventory view
 ***********************************/
invCont.addnewInventoryView = async function(req, res, next){
  const inv_id = req.params.inv_Id
  const data = await invModel.getInventoryById(inv_id)
  const list = await utilities.getDropDown(data)
  let nav = await utilities.getNav()
  try{

    res.render('./inventory/add-inventory',{
      title:'Add Inventory',
      nav,
      errors: null,
      list

    })  
  }catch(error){
    console.error(
      'Hi, sorry, an error has occurred in inventoryController.renderAddClassificationView.',
      error
    )
    next(error)
  }
}

invCont.addnewClassification = async function(req, res){
  try{
    const { classification_name } = req.body    
    const result = await invModel.addNewClassification(classification_name)
    
    if(result){
      
      req.flash('notice', `${classification_name} has been added.`)
      let nav = await utilities.getNav()       
      //Clear and rebuild the nav bar before rendering the management view      
      res.status(201).render('./inventory/management',{
        title: 'Vehicle Management',
        nav,
        errors: null
      })
    }else{
      req.flash('notice', 'Sorry, adding the classification failed')
      //Render the add-classification view with an error message
      res.status(501).render('inventory/add-classification', {
        title: 'Add Classification',
        nav, 
        errors: null
      })
    }
  }catch(error){
    console.error(
      'Hi, sorry, I know you are working so hard, but this is not the route.', error)
      res.status(500).send('Internal Server Error')
  }
}

invCont.addnewInventory = async function(req, res){
  let nav = await utilities.getNav()
  let list = await utilities.getDropDown()
  try{
    const {         
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      } = req.body  

    const result = await invModel.addInventory(        
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      )
    
    if(result){
      
      req.flash('notice', `${inv_make} ${inv_model} has been added.`)
      //const grid = await utilities.buildInventoryDetailGrid(data)
      let nav = await utilities.getNav()       
      //Clear and rebuild the nav bar before rendering the management view      
      res.status(201).render('./inventory/management',{
        title: 'Vehicle Management',
        nav,
        errors: null,
        list
        
      })
    }else{
      req.flash('notice', 'Sorry, adding the Inventory failed')
      //Render the add-Inventory view with an error message
      res.status(501).render('./inventory/add-inventory', {
        title: 'Add Inventory',
        nav, 
        errors: null,
        list
      })
    }
  }catch(error){
    console.error(
      'Hi, sorry, I know you are working so hard, but this is not the route.', error)
      res.status(500).send('Internal Server Error')
  }
}

/********************************************
 * Return Inventory by classification as JSON
 *******************************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  console.log(classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  
  if (invData[0].inv_id){
    return res.json(invData)
  } else {
    next(new Error('No data returned'))
  }
}


/***********************************
 * build an editing Inventory view
 ***********************************/
invCont.editInventoryView = async (req, res, next) => {
  const inv_id = parserInt(req.params.inv_Id)
  const data = await invModel.getInventoryById(inv_id)
  const list = await utilities.getDropDown(data)
  let nav = await utilities.getNav()
  const itemName = `${data.inv_make} ${data.inv_model}`
  res.render('./inventory/edit-inventory', {
    title: 'Edit ' + itemName,
    nav,
    list,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}



module.exports = invCont