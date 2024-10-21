import React, { useEffect, useState } from "react";
import "./Home.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TaskModal } from "./TaskModal";
import ViewModal from "./ViewModal/ViewModal";
import EditModal from "./EditModal/EditModal";
import DeleteModal from "./DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";

let base_uri = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  const [draggedTask, setDraggedTask] = useState(null);
  const navigate = useNavigate();

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch TODO tasks from backend
  const getData = async () => {
    const token = localStorage.getItem("jwt");

    const res = await fetch(`${base_uri}/gettask`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.status === 422 || !data) {
      console.log("Error fetching tasks");
    } else {
      setTodoTasks(data);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
    getData();
  }, []);

  // Drag-and-drop handlers
  const onDragStart = (task, status) => {
    setDraggedTask({ ...task, currentStatus: status });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();

    if (!draggedTask) return;

    // Remove task from its current status array
    let updatedTodoTasks = [...todoTasks];
    let updatedInProgressTasks = [...inProgressTasks];
    let updatedDoneTasks = [...doneTasks];

    // Depending on the current status of the dragged task, remove it from the appropriate array
    if (draggedTask.currentStatus === "TODO") {
      updatedTodoTasks = updatedTodoTasks.filter(
        (task) => task.title !== draggedTask.title
      );
    } else if (draggedTask.currentStatus === "INPROGRESS") {
      updatedInProgressTasks = updatedInProgressTasks.filter(
        (task) => task.title !== draggedTask.title
      );
    } else if (draggedTask.currentStatus === "DONE") {
      updatedDoneTasks = updatedDoneTasks.filter(
        (task) => task.title !== draggedTask.title
      );
    }

    // Add the dragged task to the new status array
    const updatedTask = { ...draggedTask, currentStatus: newStatus };

    if (newStatus === "TODO") {
      updatedTodoTasks.push(updatedTask);
    } else if (newStatus === "INPROGRESS") {
      updatedInProgressTasks.push(updatedTask);
    } else if (newStatus === "DONE") {
      updatedDoneTasks.push(updatedTask);
    }

    // Update state with the new task arrays
    setTodoTasks(updatedTodoTasks);
    setInProgressTasks(updatedInProgressTasks);
    setDoneTasks(updatedDoneTasks);
    setDraggedTask(null); // Clear the dragged task state
  };

  // Render task cards
  const renderTaskCards = (tasks, status) => {
    return tasks.map((task, index) => (
      <div
        key={index}
        className="task-card"
        draggable
        onDragStart={() => onDragStart(task, status)}
      >
        <h4>{task.title}</h4>
        <p>{task.desc}</p>
        {/* <p>Created at: {task.createdAt}</p> */}
        <p>
          Created at:{" "}
          {new Date(task.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>

        <div className="task-actions">
          <button
            className="delete-btn"
            onClick={() => {
              setSelectedTaskId(task._id); // Set selected task id
              handleOpenDeleteModal();
            }}
          >
            Delete
          </button>
          <button
            onClick={() => {
              setSelectedTaskId(task._id); // Set selected task id
              handleOpenEditModal();
            }}
            className="edit-btn"
          >
            Edit
          </button>
          <button
            className="view-btn"
            onClick={() => {
              setSelectedTaskId(task._id); // Set selected task id
              handleOpenViewModal();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    ));
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //viewModal
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  const handleOpenViewModal = () => {
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedTaskId(false); // Clear selected task when closing modal
  };

  //Edit Modal
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedTaskId(false); // Clear selected task when closing modal
  };

  //delete Modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTaskId(false); // Clear selected task when closing modal
  };

  return (
    <div className="task-manager-container">
      <ToastContainer />
      <button className="add-task-button" onClick={handleOpenModal}>
        Add Task
      </button>

      <div className="filter-bar">
        <div className="search-container">
          <label>Search: </label>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="sort-container">
          <label>Sort By: </label>
          <select>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="task-board">
        {/* TODO Column */}
        <div
          className="task-column"
          onDragOver={onDragOver}
          onDrop={(e) => handleDrop(e, "TODO")}
        >
          <h3>TODO</h3>
          {renderTaskCards(todoTasks, "TODO")}
        </div>

        {/* INPROGRESS Column */}
        <div
          className="task-column"
          onDragOver={onDragOver}
          onDrop={(e) => handleDrop(e, "INPROGRESS")}
        >
          <h3>INPROGRESS</h3>
          {renderTaskCards(inProgressTasks, "INPROGRESS")}
        </div>

        {/* DONE Column */}
        <div
          className="task-column"
          onDragOver={onDragOver}
          onDrop={(e) => handleDrop(e, "DONE")}
        >
          <h3>DONE</h3>
          {renderTaskCards(doneTasks, "DONE")}
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <TaskModal handleClose={handleCloseModal} getDataFn={getData} />
      )}

      {/* modal to view task */}
      {isViewModalOpen && (
        <ViewModal
          handleCloseViewModal={handleCloseViewModal}
          taskId={selectedTaskId}
        />
      )}

      {/* modal to edit task */}
      {isEditModalOpen && (
        <EditModal
          handleCloseEditModal={handleCloseEditModal}
          taskId={selectedTaskId}
          getDataFn={getData}
        />
      )}

      {/* modal to delete task */}
      {isDeleteModalOpen && (
        <DeleteModal
          handleCloseDeleteModal={handleCloseDeleteModal}
          taskId={selectedTaskId}
          getDataFn={getData}
        />
      )}
    </div>
  );
};

export default Home;
