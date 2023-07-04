const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const {check, validationResult} =require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.get('/', verifyToken , async(req,res) => {
    try{
        try{
            let users = await User.find();
            if(users.length == 0){
                res.status(404).json({error: "No users available."});
            }else{
                res.status(200).json({success: users});
            }
        }catch(e){
            res.status(403).json({error:"Something went wrong. Please try later"});
        }
    }catch(e){
        res.status(500).json({error:"Something went wrong. Please try later"});
    }
});

//signup
router.post('/signup', formValidation , async(req,res)=>{
    try{
        try{
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                res.status(403).json({errors: errors.mapped()});
            }else{
                const salt = await bcrypt.genSalt();
                let password = await bcrypt.hash(req.body.password, salt);
            let user = new User({
                username: req.body.username,
                email: req.body.email,
                password: password,
            });
            let result = await user.save();
            let token = createToken(result._id);
            res.status(201).cookie('jwt', token, {httpOnly: true}).json({user: result});
        }
        }catch(e){
            res.status(403).json({error: e.message});  
        }
    }catch(e){
        res.status(500).json({error: e.message}); 
    }
});

//Login
router.post('/login', loginValidation , async(req,res) => {
    try{
        try{
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                res.status(400).json({error: errors.mapped()});
            }else{
                let user = await User.findOne({ email: req.body.email });
                let auth = await bcrypt.compare(req.body.password, user.password);
                if(auth){
                    let token = createToken(user._id);
                    res.status(200).cookie('jwt', token, {httpOnly: true}).json({success: user});
                }else{
                    res.status(403).json({error: "Unauthorized"});         
                }
            }
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }catch(e){
        res.status(500).json({error: e.message});
    }

});

//Logout
router.get('/logout', (req,res) => {
    try{
        res.cookie('jwt','')
        .status(200)
        .json({success: "Logged out"});
    }catch(e){
        res.status(500).json({error: e.message});
    }  
});

//User Profile
router.get('/profile', verifyToken , async(req,res)=>{
    try{
        try{
        let user = await User.findById(req.userId);
        if(user == null){
            res.status(404).json({error: "Sorry, cannot find user."})
        }else{
            res.status(200).json(user);
        }
        }catch(e){
    res.status(500).json({error: "Something went wrong. Please try again later"});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try again later"});
    }
});


//Edit User Profile
router.get('/profile/edit', verifyToken , async(req,res)=>{
    try{
        try{
        let user = await User.findById(req.userId);
        if(user == null){
            res.status(404).json({error: "Sorry, cannot find user."})
        }else{
            const salt = await bcrypt.genSalt();
            let password = await bcrypt.hash(req.body.password, salt);
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = password;
            let rs = await user.save();
            res.status(200).json(rs);
        }
        }catch(e){
    res.status(500).json({error: "Something went wrong. Please try again later"});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try again later"});
    }
});

//Assign Role
router.get('/user/role/:id', verifyToken , async(req,res)=>{
    try{
        try{
        let user = await User.findById(req.params.id);
        if(user == null){
            res.status(404).json({error: "Sorry, cannot find user."})
        }else{
            user.role = req.body.role;
            let rs = await user.save();
            res.status(200).json(rs);
        }
        }catch(e){
    res.status(500).json({error: "Something went wrong. Please try again later"});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try again later"});
    }
});


//Find specific user
router.get('/profile/:id', verifyToken , async(req,res)=>{
    try{
        try{
        let user = await User.findById(req.params.id);
        if(user == null){
            res.status(404).json({error: "Sorry, cannot find user."})
        }else{
            res.status(200).json(user);
        }
        }catch(e){
    res.status(500).json({error: "Something went wrong. Please try again later"});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try again later"});
    }
});

//Delete or deactivate
router.delete('/delete', verifyToken, async(req,res) => {
    try{
        try{
            await User.findByIdAndDelete(req.userId);
            res.cookie('jwt','').status(200).json({success: "User deleted"});
        }catch(e){
            res.status(500).json({error: "Something went wrong. Please try again later"});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try again later"});
    }
});



module.exports = router;