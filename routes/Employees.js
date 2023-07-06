const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee.js');
const {check} =require('express-validator');

const formValidation = [
    check('firstname').notEmpty().withMessage('Firstname is required'),
    check('lastname').notEmpty().withMessage('Lastname is required.'),
    check('email').isEmail().notEmpty().withMessage('Valid Email Address is required.'),
    check('address').notEmpty().withMessage('Address is required.'),
    check('phone').notEmpty().withMessage('Phone Address is required.')
];

//EmployeesController
const { getAllEmployees, addNewEmployee, getEmployee, editEmployee, deleteEmployee } = require('../controllers/EmployeesController')

router.get('/', getAllEmployees);
router.post('/', formValidation , addNewEmployee);
router.put('/:id', formValidation , editEmployee);
router.delete('/delete/:id', deleteEmployee);
router.get('/:id', getEmployee);

module.exports = router;