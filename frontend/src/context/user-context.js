import React, { useState } from "react";

const userContext = React.createContext({
  userName: null,
  email: null,
  role: null,
  activeOrganization: null,
  setUserName: (name) => {},
  setEmail: (email) => {},
  setRole: (role) => {},
  setActiveOrganization: (active) => {},
});

export const UserContextProvider = (props) => {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [activeOrganization, setActiveOrganization] = useState(null);

  const contextValue = {
    userName: userName,
    email: email,
    role: role,
    activeOrganization: activeOrganization,
    setUserName: setUserName,
    setEmail: setEmail,
    setRole: setRole,
    setActiveOrganization: setActiveOrganization,
  };

  return (
    <userContext.Provider value={contextValue}>{props.children}</userContext.Provider>
  );
};

export default userContext;
