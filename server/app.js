const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('./database/connection.js')
require('./models/userModel.js')
require('./models/taskModel.js')
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(require('./routes/auth/auth.js'));
app.use(require("./routes/task/task.js"));


app.listen(PORT, ()=>{
    console.log('server is listening on the port '+ PORT)
})
