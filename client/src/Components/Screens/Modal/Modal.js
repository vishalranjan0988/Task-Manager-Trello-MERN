import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {LoginContext} from '../../../context/LoginState'
import { RiCloseLine } from "react-icons/ri";
import './Modal.css'

export default function Modal() {

    const navigate = useNavigate()

    const {setModalOpen} = useContext(LoginContext)

  return (
    <div className='darkBg' onClick={()=> setModalOpen(false)} >
        <div className="centered">
            <div className="modal">
                {/* modal header */}
                <div className="modalHeader">
                    <h5 className="heading">Confirm</h5>
                </div>
                <button className="closeBtn" onClick={()=> setModalOpen(false)} >
                    <RiCloseLine/>
                </button>
                {/* modal content */}
                <div className="modalContent">
                    Do you really want to log out ?
                </div>
                <div className="modalActions">
                    <div className="actionsContainer">
                        <button className="logOutBtn" onClick={()=>{
                            setModalOpen(false)
                            localStorage.clear()
                            navigate('/login')
                        }}>
                            Log out
                        </button>
                        <button className="cancelBtn" onClick={()=> setModalOpen(false)} >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
