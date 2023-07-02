const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String
    }
});

module.exporst = mongoose.model('User', schema);