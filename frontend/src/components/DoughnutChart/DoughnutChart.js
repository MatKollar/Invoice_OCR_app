import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useStyles } from "./styles";

const DoughnutChart = ({ handleCloseChart }) => {
  const classes = useStyles();
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: ["Recognizing", "Parsing", "Other"],
    datasets: [
      {
        label: "Time",
        data: [12, 19, 3],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleIsChartOpen = () => {
    handleCloseChart(false);
  };

  return (
    <>
      <div className={classes.center}>
        <Paper
          elevation={3}
          sx={{ pl: 15, pr: 15, pt: 2, pb: 10, borderRadius: 10, textAlign: "left" }}
        >
          <IconButton onClick={handleIsChartOpen}>
            <ArrowBackIcon />
          </IconButton>
          <div className={classes.chartContainer}>
            <Doughnut data={data} />
          </div>
          <p className={classes.centerText}>50%</p>
          <p className={classes.paragraph}>Total invoice processing time: </p>
        </Paper>
      </div>
    </>
  );
};

export default DoughnutChart;
