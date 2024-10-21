import React, { useContext, useEffect, useState } from "react";
import "./ViewModal.css";
let base_uri = process.env.REACT_APP_BASE_URL;

export default function ViewModal({ handleCloseViewModal, taskId }) {
  const [getTaskdata, setTaskdata] = useState([]);

  //function to get data so that we can show it 
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

  return (
    <div className="modal-overlay">
      <div className="modal-content-1">
        <h2>Task Details</h2>
        <h4>Title: {getTaskdata.title}</h4>
        <p>Description: {getTaskdata.desc}</p>
        <div className="modal-actions">
          <button onClick={handleCloseViewModal}>Close</button>
        </div>
      </div>
    </div>
  );
}
