import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const Page = () => {

    const handleGoogleLoginSuccess = async (response) => {
        try {
          const { credential } = response;  // This is the Google Token
          const res = await axios.post('http://localhost:5001/auth/google', {
            token: credential,
          });
    
          const { token } = res.data;  // This is the JWT token
    
          // Store JWT token in local storage or context
          localStorage.setItem('token', token);
          console.log('Login Success', res.data);
        } catch (error) {
          console.error('Login failed', error);
        }
      };

  return (
    <>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="App">
        <h1>Google Login</h1>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.error('Login Failed')}
        />
      </div>
    </GoogleOAuthProvider>
    </>
  )
}

export default Page