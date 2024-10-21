import React, { useContext, useEffect, useState } from "react";
import "./DeleteModal.css";
let base_uri = process.env.REACT_APP_BASE_URL;

const DeleteModal = ({ handleCloseDeleteModal, taskId, getDataFn }) => {
  //to get data to show the name of file we are going to delete
  const [getTaskdata, setTaskdata] = useState([]);

  const getData = async () => {
    const token = localStorage.getItem("jwt");

    const res = await fetch(`${base_uri}/gettask/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 422 || !data) {
      console.log("error");
    } else {
      setTaskdata(data);
      console.log("data got sucessfully");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //function to delete task
  const deleteTask = async () => {
    const token = localStorage.getItem("jwt");

    const res2 = await fetch(`${base_uri}/deletetask/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const deletedata = await res2.json();
    console.log(deletedata);

    if (res2.status === 422 || !deletedata) {
      console.log("error");
    } else {
      handleCloseDeleteModal();
      console.log("user deleted");
      getDataFn();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-1">
        <p>
          Are you sure you want to delete <b>{getTaskdata.title} </b> task?
        </p>
        <div className="modal-actions">
          <button onClick={deleteTask}>Delete</button>
          <button onClick={handleCloseDeleteModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
