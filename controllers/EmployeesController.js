const {check, validationResult} = require('express-validator');
const Employee = require('../models/Employee');

async function getAllEmployees(req, res){
    try{
        try{
            const emps = await Employee.find();
            res.status(200).json({ success: emps});
        }catch(e){
        res.status(404).json({error: "No employees available at the moment." + e.message});   
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try later"});
    }
} 

async function addNewEmployee(req, res){
    try{
        try{
            const result = validationResult(req);
            if(!result.isEmpty()){
                res.status(401).json({error: result.mapped()});
            }else{

                const emp = await Employee.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.phone
                });
                let rs = await emp.save();
                res.status(201).json({success: rs});
            }
        }catch(e){
            res.status(401).json({error: "Invalid Entry." + e.message});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try later"});
    }   
}

async function editEmployee(req, res){
    try{
        try{
            let result = validationResult(req);
            if(!result.isEmpty()){
                res.status(401).json({error: result.mapped()});
            }else{
                let emp = await Employee.findById(req.params.id);
                emp.firstname = req.body.firstname;
                emp.lastname = req.body.lastname;
                emp.email = req.body.email;
                emp.address = req.body.address;
                emp.phone = req.body.phone;
                let rs = await emp.save();
                res.status(200).json({success: rs});
            }
        }catch(e){
            res.status(401).json({error: "Invalid Entry." + e.message});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try later"});
    }
}


async function getEmployee(req,res){
    try{
        try{
            let rs = await Employee.findById(req.params.id);
            res.status(200).json({success: rs});
        }catch(e){
            res.status(404).json({error: "Employee not found."});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try later"});
    }
}

async function deleteEmployee(req,res){
    try{
        try{
            await Employee.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true});
        }catch(e){
            res.status(404).json({error: "Employee not found."});
        }
    }catch(e){
        res.status(500).json({error: "Something went wrong. Please try later"});
    }
};

module.exports = { getAllEmployees, addNewEmployee, getEmployee, editEmployee, deleteEmployee }

