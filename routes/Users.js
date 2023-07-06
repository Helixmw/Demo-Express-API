const express = require('express');
const router = express.Router();
//const User = require('../models/User.js');
const {check, validationResult} =require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { editProfile, getUsers, signUp, login, logout, userProfile, assignRole, specificUser, deleteUser } = require('../controllers/AuthController');

const formValidation = [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().notEmpty().withMessage('Valid Email Address is required.'),
    check('password').notEmpty().withMessage('Password is required.'),
]

const loginValidation = [
    check('email').isEmail().withMessage('Please enter valid email'),
    check('password').notEmpty().withMessage('Please enter password')
];

function createToken(id){
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60
    });
}


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

router.get('/', verifyToken , getUsers);

//signup
router.post('/signup', formValidation , signUp);

//Login
router.post('/login', loginValidation , login);

//Logout
router.get('/logout', logout);

//User Profile
router.get('/profile', verifyToken , userProfile);


//Edit User Profile
router.get('/profile/edit', verifyToken , editProfile);

//Assign Role
router.get('/user/role/:id', verifyToken , assignRole);


//Find specific user
router.get('/profile/:id', verifyToken , specificUser);

//Delete or deactivate
router.delete('/delete', verifyToken, deleteUser);



module.exports = router;