import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {toast} from 'react-toastify'
import React, { useEffect, useState } from 'react'
import './SignUp.css'
import {Link, useNavigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let base_uri = process.env.REACT_APP_BASE_URL

const SignUp = () => {

    useEffect(()=>{
      const token = localStorage.getItem("jwt")
      if(token){
          navigate('/')
      }
  })

  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //toast function
  const notifyA = (data)=> toast.success(data)
  const notifyB = (data)=> toast.error(data)

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

  const postUser =()=> {
    //checking email and password
    if(!emailRegex.test(email)){
      notifyB('Invalid Email')
      return
    }else if(!passwordRegex.test(password)){
      notifyB('Password must contain at least 8 characters, including at least 1 number and must include both lower and uppercase letters and special characters for example #,?,! ')
      return
    }else if(password !== confirmPassword){
      notifyB('Password and Confirm Password are not same')
      return
    }

    fetch(`${base_uri}/signup`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
      })
  }).then(response => response.json())
    .then(data =>{
      if(data.error){
          notifyB(data.error)
      }else{
          notifyA(data.message)
          navigate('/login')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  //Sign Up with google
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;  // This is the Google Token
      const res = await axios.post(`${base_uri}/auth/google`, {
        token: credential,
      });

      const { token } = res.data;  // This is the JWT token

      // Store JWT token in local storage or context
      localStorage.setItem('jwt', token);
      console.log('Login Success', res.data);
      navigate('/')
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer/>
        <div className="signup-text"><h2>Signup</h2>
      <div className="signup-box">
        <form className="signup-form">
          <input type="text" placeholder="First Name" name='firstName' value={firstName} onChange={(e)=> setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" name='lastName' value={lastName} onChange={(e)=> setLastName(e.target.value)} />
          <input type="email" placeholder="Email" name='email' value={email} onChange={(e)=> setEmail(e.target.value)} />
          <input type="password" placeholder="Password" name='password' value={password} onChange={(e)=> setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" name='confirmPassword' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} />
          <button type="submit" className="signup-button" onClick={(e)=> {
            e.preventDefault();
            postUser()
            }} >Signup</button>
        </form>
        <p className="login-text">
          Already have an account? <Link to={'/login'}>Login</Link>
        </p>

        {/* continue with google */}
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <div className="App">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => console.error('Login Failed')}
            />
          </div>
        </GoogleOAuthProvider>
    
      </div>
      </div>
    </div>
  )
}

export default SignUp