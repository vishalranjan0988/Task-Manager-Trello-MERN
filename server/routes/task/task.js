const express = require("express");
const router =  express.Router();
const mongoose = require("mongoose")
const tasks = mongoose.model("task")
const requireLogin = require('../../middlewares/requireLogin')

//create task

router.post("/addtask", requireLogin, async (req,res)=>{
    const {title, desc} = req.body;

    if(!title || !desc) {
        res.status(422).json({error: "Please fill title and description"})
    }

    try {
        const preTask = await tasks.findOne({title: title});

        if(preTask){
            res.status(422).json({error: "This task is already present"})
        }else{
            //add task
            const addTask = new tasks({
                title,
                desc,
                createdBy: req.user._id
            })
    
            await addTask.save();
            res.status(201).json({addTask, message: "Task Added Successfully"})
        } 
    } catch (error) {
        res.status(422).json(error)
    }
    
})

//get all task

router.get('/gettask', requireLogin, async (req, res) => {
    try {
        // Fetch tasks created by the logged-in user
        const taskData = await tasks.find({ createdBy: req.user._id });
        res.status(200).json(taskData);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(422).json({ error: 'Error fetching tasks' });
    }
});


//get individual task

router.get('/gettask/:id', requireLogin, async (req,res)=>{
    try {
        const {id} = req.params;

        const individualTask = await tasks.findById({_id: id});
        res.status(201).json(individualTask);
    } catch (error) {
        res.status(422).json(error)
    }
})

//update task

router.patch('/updatetask/:id', requireLogin, async(req,res)=>{
    try {
        const {id} = req.params;

        const updatedTask = await tasks.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.status(201).json(updatedTask);
    } catch (error) {
        res.status(422).json(error);
    }
})

//delete Task

router.delete('/deletetask/:id', requireLogin, async (req, res)=>{
    try {
        const {id} = req.params;

        const deleteTask = await tasks.findByIdAndDelete({_id: id});
        res.status(201).json(deleteTask);
    } catch (error) {
        res.status(422).json(error);
    }
})


module.exports = router
