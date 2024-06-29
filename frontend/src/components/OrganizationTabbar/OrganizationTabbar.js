import { useState, useContext, useEffect } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import userContext from "../../context/user-context";
import { useStyles } from "./styles";
import { COLORS } from "../../styles/constants";

const tabs = [
  { label: "ORGANIZATIONS", icon: <CorporateFareIcon sx={{ mr: 1 }} />, value: 0 },
  { label: "JOIN", icon: <GroupAddIcon sx={{ mr: 1 }} />, value: 1 },
  {
    label: "CREATE",
    icon: <AddCircleIcon sx={{ mr: 1 }} />,
    value: 2,
    restricted: ["user"],
  },
];

const OrganizationTabbar = ({ activePage, onPageChange }) => {
  const classes = useStyles();
  const { role } = useContext(userContext);

  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(activePage);
  }, [activePage]);

  const handleChange = (event, newValue, tabName) => {
    setValue(newValue);
    onPageChange(newValue, tabName);
  };

  return (
    <Grid container className={classes.rootContainer}>
      <Grid item xs={12} container justifyContent="center" flexWrap="wrap">
        <Tabs
          className={classes.tabsContainer}
          TabIndicatorProps={{
            style: {
              backgroundColor: COLORS.PRIMARY,
            },
          }}
          value={value}
          variant="scrollable"
          classes={{ indicator: classes.indicator }}
        >
          {tabs.map(
            (tab) =>
              (!tab.restricted || !tab.restricted.includes(role)) && (
                <Tab
                  classes={{ selected: classes.tabSelected }}
                  key={tab.value}
                  sx={{
                    mx: { xs: 0, sm: 1, md: 3, lg: 5 },
                    p: 2,
                    color: value === tab.value ? "inherit" : "black",
                  }}
                  label={
                    <Typography sx={{ display: "flex"}}>
                      {tab.icon}
                      <span className={classes.text}>{tab.label}</span>
                    </Typography>
                  }
                  value={tab.value}
                  onClick={(e) => handleChange(e, tab.value, tab.label)}
                />
              ),
          )}
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default OrganizationTabbar;
