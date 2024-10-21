import React, { createContext, useState } from "react";

export const LoginContext = createContext(null);
export const contextAddData = createContext(null);
export const updateData = createContext(null);
export const delData = createContext(null);

export default function LoginState({ children }) {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [tdata, setTdata] = useState("");
  const [upData, setUPdata] = useState("");
  const [dltData, setDLTdata] = useState("");

  return (
    <delData.Provider value={{ dltData, setDLTdata }}>
      <updateData.Provider value={{ upData, setUPdata }}>
        <contextAddData.Provider value={{ tdata, setTdata }}>
          <LoginContext.Provider
            value={{
              userLogin,
              setUserLogin,
              modalOpen,
              setModalOpen,
              loggedUser,
              setLoggedUser,
            }}
          >
            {children}
          </LoginContext.Provider>
        </contextAddData.Provider>
      </updateData.Provider>
    </delData.Provider>
  );
}
