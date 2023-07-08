const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee.js');
const {check} =require('express-validator');
const jwt = require('jsonwebtoken');

const formValidation = [
    check('firstname').notEmpty().withMessage('Firstname is required'),
    check('lastname').notEmpty().withMessage('Lastname is required.'),
    check('email').isEmail().notEmpty().withMessage('Valid Email Address is required.'),
    check('address').notEmpty().withMessage('Address is required.'),
    check('phone').notEmpty().withMessage('Phone Address is required.')
];

//EmployeesController
const { getAllEmployees, addNewEmployee, getEmployee, editEmployee, deleteEmployee } = require('../controllers/EmployeesController')

function verifyToken(req,res,next){
    const token = req.cookies.jwt;
    try{  
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if(err){
                res.status(403).json({error: "Unauthorized"});
            }else{
                req.userId = decodedToken.id;
                next();
            }
        });
    }else{
        res.status(403).json({error: "No Token"});
    }
    }catch(e){
    res.status(500).json({error: e.message});
}
}

router.get('/', getAllEmployees);
router.post('/', verifyToken , formValidation , addNewEmployee);
router.put('/:id', verifyToken , formValidation , editEmployee);
router.delete('/delete/:id', verifyToken , deleteEmployee);
router.get('/:id', verifyToken , getEmployee);

module.exports = router;