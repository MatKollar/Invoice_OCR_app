import { useContext, useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import userContext from "../../context/user-context";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useStyles } from "./styles";
import UsersTable from "../../components/UsersTable/UsersTable";

const UsersPage = () => {
  const classes = useStyles();
  const userCtx = useContext(userContext);
  const role = userCtx.role;
  const [userName, setUserName] = useState();
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    (async () => {
      if (role !== "admin") {
        window.location.href = "/";
      } else {
        try {
          const resp = await httpRequest.get("http://localhost:5000/get-users");
          console.log(resp.data.users);
          setUsersData(resp.data.users);
        } catch (error) {
          console.log("Not authenticated");
          window.location.href = "/login";
        }
      }
    })();
  }, [role]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get("http://localhost:5000/@me");
        userCtx.setUserName(resp.data.name);
        userCtx.setEmail(resp.data.email);
        userCtx.setRole(resp.data.role);
        setUserName(resp.data.name);
      } catch (error) {
        console.log("Not authenticated");
        window.location.href = "/login";
      }
    })();
  }, []);

  return (
    <>
      <AppLayout userName={userName}>
        <div className={classes.tableContainer}>
          <UsersTable users={usersData} />
        </div>
      </AppLayout>
    </>
  );
};

export default UsersPage;
