require('dotenv').config();
const {validationResult} =require('express-validator');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function createToken(id){
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60
    });
}

async function getUsers(req,res){
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
}

async function signUp(req,res){
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
}

async function login(req,res){
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
            res.status(500).json({error: "Invalid Entry: " + e.message});
        }
    }catch(e){
        res.status(500).json({error: "Server problem: " + e.message});
    }
}

async function logout(req,res){
    try{
        res.cookie('jwt','')
        .status(200)
        .json({success: "Logged out"});
    }catch(e){
        res.status(500).json({error: e.message});
    } 
}

async function userProfile(req,res){
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
}


async function assignRole(req,res){
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
}

async function specificUser(req,res){
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
}


async function editProfile(req,res){
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
}

async function deleteUser(req,res){
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
}

function test(req,res){
    res.send("success");
}

module.exports = { editProfile, getUsers, signUp, login, logout, userProfile, assignRole, specificUser, deleteUser,test }