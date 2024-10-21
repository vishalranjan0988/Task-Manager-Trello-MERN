import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
let base_uri = process.env.REACT_APP_BASE_URL;

//if user is logged, then send them to '/' else this page
const Login = () => {
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      navigate("/");
    }
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //toast function
  const notifyA = (data) => toast.success(data);
  const notifyB = (data) => toast.error(data);

  //to check wheather the user has entered a correct email, we are using regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postUser = () => {
    //checking email
    if (!emailRegex.test(email)) {
      notifyB("Invalid Email");
      return;
    }

    fetch(`${base_uri}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          notifyB(data.error);
        } else {
          notifyA(data.message);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          navigate("/");
        }
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  };
  // Sign Up with google
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response; // This is the Google Token
      const res = await axios.post(`${base_uri}/auth/google`, {
        token: credential,
      });

      const { token } = res.data; // This is the JWT token

      // Store JWT token in local storage or context
      localStorage.setItem("jwt", token);
      console.log("Login Success", res.data);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="signin-container">
      <ToastContainer />
      <div className="signin-text">
        <h2>Login</h2>
        <div className="signin-box">
          <form className="signin-form">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="signin-button"
              onClick={(e) => {
                e.preventDefault();
                postUser();
              }}
            >
              Login
            </button>
          </form>
          <p className="login-text">
            Don't have an account? <Link to={"/signup"}>Signup</Link>
          </p>
          {/* continue with google */}
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          >
            <div className="App">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => console.error("Login Failed")}
              />
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;
