const mongoose = require('mongoose');
require('dotenv').config();

//connecting to mongodb

mongoose.connect(process.env.mongoUrl);

mongoose.connection.on("connected", ()=> {
    console.log("Successfully connected to mongodb")
})
mongoose.connection.on("error", ()=>{
    console.log("error connecting to mongodb")
})