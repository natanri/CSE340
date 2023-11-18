const utilities = require('.')
const { body, validationResult } = require("express-validator")
const classificationModel =require('../models/inventory-model')
const inv_validate = {}

/**************************************************
 * Checking classification daata and return errors
 * or continue to the management view
 *************************************************/
inv_validate.addClassificationRules = () => {
    return [
        body('classification_name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Classification name is required')
        .custom(async(classification_name) => {
            const classificationExists = await classificationModel.checkExistingClassification(classification_name)
            if(classificationExists){
                console.log('classification already exists')
                throw new Error('Classification name already exists')                
            }
            //Custom validation to check for spaces or special characters
            if(
                /\s./.test(classification_name) ||
                /[!@#$%^&*(),.?:{}|<>]/.test(classification_name)
            ){
                throw new Error ('Classification name cannot contain spaces or espacial characters.')
            }
        })
    ]
}

/************************************************************
 * Check data and return errors or continue to classification
 ************************************************************/
inv_validate.checkClassData = async(req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        //Handle validation errors, render a form  with error messages
        res.render('inventory/add-classification', {
            errors,
            title:'Add Classification',
            nav,
            classification_name
        })
        return
    }
    next()
}

/************************************
 * Registration Data Validation Rules
 ************************************/
inv_validate.InventoryRules = () => {
    return [
    // make is required and must be string
    body('inv_make')
    .trim()
    .isLength({ min: 3})
    .withMessage('Please provide a make.'),//on error this message is sent

    //model is required and cannot already exist in the DB
    body('inv_model')
    .trim()
    .isLength({ min: 3})
    .withMessage('Please provide a model.'),//on error this message is sent

    //description is required and cannot already exist in the DB
    body('inv_description')
    .trim()
    .isLength({ min: 1})
    .withMessage('A valid description.'),

     //Price is required and it most be an integer
    body('inv_price')
    .trim()
    .isLength({ min: 1})
    .withMessage('Please provide a price.'),//on error this message is sent

    //year is required and most be a integer
    body('inv_year')
    .trim()
    .isLength({ min: 4})
    .withMessage('Please provide a year.'),//on error this message is sent

    body('inv_miles')
    .trim()
    .isLength({ min: 1})
    .withMessage('Please provide a miles.'),//on error this message is sent

    //Proce is required and most be a string
    body('inv_color')
    .trim()
    .isLength({ min: 3})
    .withMessage('provide a color.'),//on error this message is sent
    ]
}

/************************************************************
 * Check data and return errors or continue to inventory
 ************************************************************/
inv_validate.checkVehicleData = async(req, res, next) => {
    let list = await utilities.getDropDown()
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
        classification_id,
        } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        //Handle validation errors, render a form  with error messages
        res.render('inventory/add-inventory', {
            errors,
            title:'Add Inventory',
            nav,
            list,            
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
            
        })
        return
    }
    next()
}

module.exports = inv_validate