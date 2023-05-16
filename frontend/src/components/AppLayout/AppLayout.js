import { useState } from "react";

import SideMenu from "../SideMenu/SideMenu";
import Navbar from "../Navbar/Navbar";
import { useStyles } from "./styles";

const AppLayout = (props) => {
  const classes = useStyles();
  const [sideMenuVisible, setSideMenuVisible] = useState(true);

  return (
    <div className={classes.pageWrapper}>
      <SideMenu visible={sideMenuVisible} onClose={() => setSideMenuVisible(false)} />
      <div
        className={`${classes.contentWrapper} ${
          sideMenuVisible ? "" : classes.contentWrapperExpanded
        }`}
      >
        <Navbar
          userName={props.userName}
          sideMenuVisible={sideMenuVisible}
          toggleSideMenu={() => setSideMenuVisible(!sideMenuVisible)}
        />
        {props.children}
      </div>
    </div>
  );
};

export default AppLayout;
