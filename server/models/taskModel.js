const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "USER", // This references the User model
    }
});

mongoose.model("task", taskSchema); // Changed userSchema to taskSchema for better clarity
