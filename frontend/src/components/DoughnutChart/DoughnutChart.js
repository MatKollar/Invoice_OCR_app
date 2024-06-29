import React, { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSnackbar } from "notistack";
import { Paper, Tooltip as MuiTooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import { useStyles } from "./styles";
import httpRequest from "../../httpRequest";

const DoughnutChart = ({ handleCloseChart, invoice_id }) => {
  const classes = useStyles();
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [recognition, setRecognition] = useState(null);
  const [parsing, setParsing] = useState(null);
  const [other, setOther] = useState(null);
  const [score, setScore] = useState(null);
  const [ocrMethod, setOcrMethod] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await httpRequest.post(
          `${process.env.REACT_APP_BACKEND_URL}/get-performance-data`,
          {
            invoice_id: invoice_id,
          },
        );
        setRecognition(resp.data.recognition_time);
        setParsing(resp.data.parsing_time);
        setOther(resp.data.other_time);
        setScore(resp.data.average_confidence);
        setOcrMethod(resp.data.ocr_method);
      } catch (error) {
        console.log("Error");
        enqueueSnackbar("Error fetching performance data", { variant: "error" });
      }
    };
    fetchData();
  }, [invoice_id, enqueueSnackbar]);

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
          borderColor: ["rgba(255, 99, 132)", "rgba(54, 162, 235)", "rgba(255, 206, 86)"],
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
            borderRadius: 10,
            textAlign: "left",
          }}
        >
          {recognition ? (
            <div className={classes.containers}>
              <div className={classes.titleContainer}>
                <IconButton onClick={handleIsChartOpen}>
                  <ArrowBackIcon sx={{ color: "black" }} />
                </IconButton>
                <h3 className={classes.title}>{ocrMethod} performance</h3>
                <MuiTooltip title="Tesseract and PaddleOCR score represents different metrics and are calculated using different methods so they cannot be directly compared based on this score.">
                  <PriorityHighIcon className={classes.icon} />
                </MuiTooltip>
              </div>
              <div className={classes.chartContainer}>
                <Doughnut data={data} />
              </div>
              {ocrMethod === "Tesseract" ? (
                <MuiTooltip title="Percentage indicating how confident the OCR engine was in the correctness of the recognized text.">
                  <p className={classes.centerScore}>{score.toFixed(2)}%</p>
                </MuiTooltip>
              ) : (
                <MuiTooltip title="Recognition score represents the probability of the recognized text being correct, calculated by the recognition model.">
                  <p className={classes.centerScore}>{score.toFixed(2)}%</p>
                </MuiTooltip>
              )}
              <p className={classes.paragraph}>
                Total invoice processing time:{" "}
                <strong>
                  {recognition && (recognition + parsing + other).toFixed(2)}s
                </strong>
              </p>
            </div>
          ) : (
            <div className={classes.containers}>
              <IconButton onClick={handleIsChartOpen}>
                <ArrowBackIcon />
              </IconButton>
              <p className={classes.centerText}>No data available!</p>
            </div>
          )}
        </Paper>
      </div>
    </>
  );
};

export default DoughnutChart;
