require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const employeeRoutes = require('./routes/Employees.js');
const userRoutes = require('./routes/Users.js');
const cookieParser = require('cookie-parser');

try{
mongoose.connect(process.env.DATABASE_URL);
const conn = mongoose.connection;
conn.on('error', () => {
    console.log("Unable to connect to database.");
});
conn.once('open', () => {
    console.log("Database connected");
});

const app = new express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server started at port: " + process.env.PORT);
});

}catch(e){
    console.log("Something went wrong: " + e.message);
}
