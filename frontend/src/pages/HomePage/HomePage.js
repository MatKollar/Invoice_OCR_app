import Navbar from "../../components/Navbar/Navbar";
import SelectCard from "../../components/SelectCard/SelectCard";
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
          <div className={classes.content}>
            <SelectCard />
            <canvas className={classes.invoice} id="output" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
