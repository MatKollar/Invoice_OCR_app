import React, { useState } from "react";

const userContext = React.createContext({
  userName: null,
  email: null,
  role: null,
  setUserName: (name) => {},
  setEmail: (email) => {},
  setRole: (role) => {},
});

export const UserContextProvider = (props) => {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);

  const contextValue = {
    userName: userName,
    email: email,
    role: role,
    setUserName: setUserName,
    setEmail: setEmail,
    setRole: setRole,
  };

  return (
    <userContext.Provider value={contextValue}>
      {props.children}
    </userContext.Provider>
  );
};

export default userContext;
