import React, { useEffect, useState, useRef } from "react";
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../../../css/User/userDashBoard.css";
import BasicCard from "./cards/InfoCard";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import PieArcLabel from "./cards/PieChart";
import MarkOptimization from "./cards/LineChart";
import BarLabel from "./cards/BarChart";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import PersistentDrawerLeft from "./cards/Navbar";
import InfoReactTable from "./cards/InfoTable";
import Cookies from 'js-cookie';

import { gsap } from "gsap";
import axios from "axios";
const DashBoard = () => {
  const containerRef = useRef();
  const cardRef = useRef();

  const [count, setCount] = useState(0);
  const [value, setValue] = useState([
 
  ]);

  const [barData, setBarData] = useState([
 
  ]);
  const [lineChart, setLineChart] = useState({
    dates: [],
    deforestation: [],
    airPollution: [],
  });
  const [table, setTableData] = useState([
    
  ]);

  const [currentPage, setCurrentPage] = useState(0);

  function setImageCountData(image_count) {
    setCount(image_count);
  }

  function setPieChartData(data, areaClassified) {
    if (areaClassified.get("CLOUDY")) {
      data[0].value = areaClassified.get("CLOUDY");
    }
    if (areaClassified.get("GREEN_AREA")) {
      data[1].value = areaClassified.get("GREEN_AREA");
    }
    if (areaClassified.get("DESERT")) {
      data[2].value = areaClassified.get("DESERT");
    }
    if (areaClassified.get("WATER")) {
      data[3].value = areaClassified.get("WATER");
    }
    setValue(data);

  }
  function checkAirQualityClassification(airQualityClassification, arr) {
    if (airQualityClassification) {
      let airQuality = airQualityClassification.toUpperCase();
      if (airQuality == "GOOD") {
        arr[0] = arr[0] + 1;
      } else if (airQuality == "MODERATE") {
        arr[1] = arr[1] + 1;
      } else if (airQuality == "Unhealthy_for_Sensitive_Groups".toUpperCase()) {
        arr[2] = arr[2] + 1;
      } else if (airQuality == "Unhealthy".toUpperCase()) {
        arr[3] = arr[3] + 1;
      } else if (airQuality == "Very_Unhealthy".toUpperCase()) {
        arr[4] = arr[4] + 1;
      } else if (airQuality == "Severe".toUpperCase()) {
        arr[5] = arr[5] + 1;
      }
    }
  }
  function setBarChartData(airQualityClassificationArray) {
    setBarData(airQualityClassificationArray);
  }
  function setLineChartData(lineChartData) {
    // 'dates':[],'deforestation':[],'airPollution':[]
    let dates = [];
    let deforestation = [];
    let airpollution = [];

    for (let index = 0; index < lineChartData.length; index++) {
      dates.push(lineChartData[index][0]);
      deforestation.push(lineChartData[index][1]);
      airpollution.push(lineChartData[index][2]);
    }

    let obj = {
      dates: dates,
      deforestation: deforestation,
      airPollution: airpollution,
    };
    setLineChart(obj);
  }
  function setTableDataFunction(table) {
    setTableData(table);
  }

  useEffect(() => {
    const request_url = "http://127.0.0.1:8000/get-satellite-data/";
    const fetchData = async () => {
      try {
        let data = [
          { value: 0, label: "Cloudy" },
          { value: 0, label: "Green_Area" },
          { value: 0, label: "Desert" },
          { value: 0, label: "Water" },
        ];

        let image_count = 0;
        let areaClassified = new Map();
        let airQualityClassificationArray = [0, 0, 0, 0, 0, 0];
        let fullObj = [];
        let lineChartData = [];
        console.log(Cookies.get('idToken'),"id")
        const response = await axios.get(request_url ,{
            params: {
    user_id: Cookies.get('idToken')
  },
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }).then((response)=>{

        let response_data = response.data;
      
      console.log(response)
        console.log(response_data)
        response_data['data'].forEach((element) => {
          let image_url = element.file;
          let areaClassification = element.areaClassification;
          let airQualityClassification = element.airQualityClassification;
          let date = element.date;
          let deforestationProbability = element.deforestationProbability;
          let airPollutionProbability = element.airPollutionProbability;
          let location = element.location;

          let obj = {
            image_url: image_url ? image_url : "Not Availabel",
            Date: date ? new Date(date) : "00-00-00",
            location: location ? location : "Not Availabel",
            Deforestation: deforestationProbability
              ? deforestationProbability
              : NaN,
            AirPollution: airPollutionProbability
              ? airPollutionProbability
              : NaN,
            ImageCategory: areaClassification
              ? areaClassification
              : "Not Availabel",
            IotCategory: airQualityClassification
              ? airQualityClassification
              : "Not Availabel",
          };
          fullObj.push(obj);

          if (date && deforestationProbability && airPollutionProbability) {
            lineChartData.push([
              new Date(date),
              deforestationProbability,
              airPollutionProbability,
            ]);
          }

          if (image_url && image_url.length != 0) {
            image_count++;
          }
          if (areaClassification && areaClassification.length != 0) {
            areaClassified.set(
              areaClassification.toUpperCase(),
              areaClassified.get(areaClassification) == undefined
                ? 1
                : areaClassified.get(areaClassification) + 1
            );
          }
          checkAirQualityClassification(
            airQualityClassification,
            airQualityClassificationArray
          );
        });

        lineChartData.sort((a, b) => a[0] - b[0]);
        setLineChartData(lineChartData);
        setImageCountData(image_count);
        setPieChartData(data, areaClassified);
        setBarChartData(airQualityClassificationArray);
        setTableDataFunction(fullObj);
});

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 2,
      x: -50,
      ease: "power2.out",
    });
  }, [currentPage]);

  const StyleTitle = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(0),
  }));

  return (
    <>
      <div className="mainDashBoard">
        <div className="text ">
          <StyleTitle>
            <PersistentDrawerLeft setPage={setCurrentPage} />
          </StyleTitle>
        </div>
        <div className="graphCard"></div>
        {currentPage == 0 && (
          <div className="home">
            <div className="cards">
              <div className="count  card-item" ref={cardRef}>
                <BasicCard count={count} />
              </div>
              <div className="piechart card-item">
                <PieArcLabel value={value} />
              </div>
              <div className="barLabel card-item">
                <BarLabel barData={barData} />
              </div>
            </div>
            <div className="line ">
              <div className="linechart card-item">
                <MarkOptimization lineChart={lineChart} />
              </div>
            </div>
          </div>
        )}
        {currentPage == 1 && (
          <div className="table" style={{ zIndex: "var(--zval)" }}>
            <div className="TitleTable" ref={containerRef}>
              <Typography variant="h4" align="center" sx={{ marginTop: 1 }}>
                Analytics Table
              </Typography>
            </div>
            <div className="infoTable">
              <InfoReactTable table={table} />
            </div>
          </div>
        )}
        {currentPage == 2 && (
          <div className="about">
            <div className="TitleTable" ref={containerRef}>
              <Typography
                variant="h5"
                color="GrayText"
                sx={{ marginTop: 5, marginLeft: 3 }}
              >
                About Us
              </Typography>
            </div>
            <hr />
            <div className="pollutionSection" style={{ marginLeft: "10px" }}>
              <Typography
                variant="p"
                loading
                sx={{ display: "block" }}
                gutterBottom
                color="Highlight"
              >
                Welcome to our innovative platform, where we empower you to
                monitor and analyze deforestation using cutting-edge satellite
                imagery and IoT data. Our website offers a range of features
                designed to provide you with comprehensive insights and
                actionable information.
              </Typography>
            </div>
            <hr />
            <div className="features" style={{ marginLeft: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Features:
              </Typography>
              <Typography  variant="div" color="GrayText" gutterBottom>
                <Typography
                  sx={{ display: "inline-block" }}
                  fontWeight="bold"
                  color="Highlight"
                  variant="div"
                >
                  Upload and Analyze Data:
                </Typography>
                Easily upload satellite images and IoT data to receive detailed
                insights into deforestation probabilities and air pollution
                levels.
              </Typography>
              <Typography color="GrayText" variant="div" gutterBottom>
                <Typography
                  sx={{ display: "inline-block" }}
                  fontWeight="bold"
                  variant="div"
                  color="Highlight"
                >
                  Image Analysis:
                </Typography>
                Identify key characteristics of your images, such as cloudy
                areas, green regions, deserts, and water bodies.
              </Typography>
              <Typography  variant="div" color="GrayText" gutterBottom>
                <Typography
                  sx={{ display: "inline-block" }}
                  fontWeight="bold"
                  color="Highlight"
                >
                  Air Quality Monitoring:
                </Typography>
                Using IoT data, our platform assesses air quality and
                categorizes it as good, unhealthy, and more, providing
                recommendations for improving conditions.
              </Typography>
              <Typography variant="div" color="GrayText" gutterBottom>
                <Typography
                  sx={{ display: "inline-block" }}
                  fontWeight="bold"
                  color="Highlight"
                  variant="div"
                >
                  Actionable Insights:
                </Typography>
                Get the best actions to reduce pollution based on the analyzed
                data.
              </Typography>
              <Typography variant="div" color="GrayText" gutterBottom>
                <Typography
                  sx={{ display: "inline-block" }}
                  fontWeight="bold"
                  color="Highlight"
                  variant="div"
                >
                  Interactive Dashboard:
                </Typography>
                Monitor your historical data through visually engaging graphs
                and analytics tables for better understanding and
                decision-making.
              </Typography>
            </div>
            <hr />
            <div className="pollutionSection" style={{ marginLeft: "10px" }}>
              <Typography
                variant="p"
                loading
                sx={{ display: "block" }}
                gutterBottom
                color="Highlight"
              >
                All these powerful features are made possible through advanced
                AI and ML technologies, ensuring you have the most accurate and
                insightful information at your fingertips. Join us in making a
                difference and take action to protect our environment.
              </Typography>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default DashBoard;
