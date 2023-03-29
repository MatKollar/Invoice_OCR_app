import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const DoughnutChart = ({ handleCloseChart, invoice_id }) => {
  const classes = useStyles();
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [recognition, setRecognition] = useState(null);
  const [parsing, setParsing] = useState(null);
  const [other, setOther] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpRequest.post(
          "http://localhost:5000/get-performance-data",
          {
            invoice_id: invoice_id,
          },
        );
        setRecognition(resp.data.recognition_time);
        setParsing(resp.data.parsing_time);
        setOther(resp.data.other_time);
        setScore(resp.data.average_score);
      } catch (error) {
        console.log("Error");
      }
    };
    fetchData();
  }, [invoice_id]);

  let data = "";
  if (recognition) {
    data = {
      labels: ["Recognizing", "Parsing", "Other"],
      datasets: [
        {
          label: "Time",
          data: [recognition, parsing, other],
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
  }

  const handleIsChartOpen = () => {
    handleCloseChart(false);
  };

  return (
    <>
      <div className={classes.center}>
        <Paper
          elevation={3}
          sx={{
            pl: 15,
            pr: 15,
            pt: 2,
            pb: 10,
            borderRadius: 10,
            textAlign: "left",
          }}
        >
          <IconButton onClick={handleIsChartOpen}>
            <ArrowBackIcon />
          </IconButton>
          {recognition ? (
            <>
              <div className={classes.chartContainer}>
                <Doughnut data={data} />
              </div>
              <p className={classes.centerScore}>{score.toFixed(2)}%</p>
              <p className={classes.paragraph}>
                Total invoice processing time:{" "}
                <strong>
                  {recognition && (recognition + parsing + other).toFixed(2)}s
                </strong>
              </p>
            </>
          ) : (
            <p className={classes.centerText}>No data available!</p>
          )}
        </Paper>
      </div>
    </>
  );
};

export default DoughnutChart;
