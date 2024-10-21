import React, { useContext, useState } from "react";
import "./TaskModal.css"; // Import the CSS file for modal styling
import { contextAddData } from "../../../context/LoginState";
import { toast } from "react-toastify";
let base_uri = process.env.REACT_APP_BASE_URL;

export const TaskModal = ({ handleClose, getDataFn }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const { setTdata } = useContext(contextAddData);

  //toast function
  const notifyB = (data) => toast.error(data);

  //function to save task

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    const res = await fetch(`${base_uri}/addtask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        desc: desc,
      }),
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      notifyB("error");
    } else {
      setTdata(data);
    }
    getDataFn();
    handleClose(); // Close the modal after saving
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Task</h2>
        {/* input field: title */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* input textarea field */}
        <textarea
          placeholder="Task Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSaveTask}>Save</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
