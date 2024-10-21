import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { LoginContext } from "../../context/LoginState";

export default function Navbar() {
  const { setModalOpen } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
    {/* here we are checking it user has jwt token then show Logout button else show Login and Signup button */}
      {localStorage.getItem("jwt")
        ? [
            <div className="navbar">
              <div className="logo-div">
                <EventNoteIcon />
              </div>
              <ul className="nav-items">
                <Link to="/login">
                  <li
                    className="minimalLogoutBtn"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    Logout
                  </li>
                </Link>
              </ul>
            </div>,
          ]
        : [
            <div className="navbar">
              <div className="logo-div">
                <EventNoteIcon />
              </div>
              <ul className="nav-items">
                <Link to="/login">
                  <li className="minimalLogoutBtn">Login</li>
                </Link>
                <Link to="/signup">
                  <li className="minimalLogoutBtn">Signup</li>
                </Link>
              </ul>
            </div>,
          ]}
    </>
  );
}
