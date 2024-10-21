import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from './context/LoginState.js';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import Navbar from './Components/Navbar/Navbar';
import SignUp from './Components/Screens/SignUp/SignUp.js';
import Login from './Components/Screens/Login/Login.js';
import Home from './Components/Screens/Home/Home.js';
import { useContext } from 'react';
import Modal from './Components/Screens/Modal/Modal.js';

function App() {
  //this Modal is used when we are opening Modal by clicking Logout button in Home Page.
  const {modalOpen} = useContext(LoginContext)

  return (
    <>
    <BrowserRouter>
    {/* Navbar is placed here because we need navbar, when user is logged in as well as when user is logged out */}
    <Navbar/>  
    <ToastContainer theme='dark' />
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Home/>} />
      </Routes>
      {modalOpen && <Modal/>}
    </BrowserRouter>
    </>
  );
}

export default App;
