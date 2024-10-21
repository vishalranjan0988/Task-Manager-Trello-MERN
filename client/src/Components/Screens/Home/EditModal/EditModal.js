import React, { useContext, useEffect, useState } from "react";
import "./EditModal.css";
let base_uri = process.env.REACT_APP_BASE_URL;

export default function EditModal({ handleCloseEditModal, taskId, getDataFn }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`${base_uri}/gettask/${taskId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task details");
        }

        const taskData = await response.json();
        setTitle(taskData.title); // Set previous title
        setDesc(taskData.desc); // Set previous description
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Function to handle form submission (updating task)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTaskData = {
      title,
      desc,
    };

    try {
      // Make the PATCH request to update the task
      const token = localStorage.getItem("jwt");

      const response = await fetch(`${base_uri}/updatetask/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the task");
      }

      const updatedTask = await response.json();
      handleCloseEditModal();
      console.log("Task updated successfully");
      getDataFn();
      console.log(updatedTask);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
