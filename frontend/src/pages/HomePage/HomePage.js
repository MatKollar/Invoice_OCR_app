import Navbar from "../../components/Navbar/Navbar";
import SideMenu from "../../components/SideMenu/SideMenu";

import { useStyles } from "./styles";

const HomePage = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.pageWrapper}>
        <SideMenu />
        <div className={classes.contentWrapper}>
          <Navbar />
          <p>Content</p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
