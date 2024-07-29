import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDrawingArea, useXScale, useYScale } from "@mui/x-charts/hooks";
import {useTheme} from '@mui/material';

import {useMediaQuery} from '@mui/material';
import { BarChart } from "@mui/x-charts";



const ratios = [0.2, 0.8, 0.6, 0.5];
const LoadingReact = styled("rect")({
  opacity: 0.2,
  fill: "lightgray",
});

const LoadingText = styled("text")(({ theme }) => ({
  stroke: "none",
  fill: theme.palette.text.primary,
  shapeRendering: "crispEdges",
  textAnchor: "middle",
  dominantBaseline: "middle",
}));

function LoadingOverlay() {
  const xScale = useXScale();
  const yScale = useYScale();
  const { left, width, height } = useDrawingArea();

  const bandWidth = xScale.bandwidth();

  const [bottom, top] = yScale.range();

  return (
    <g>
      {xScale.domain().map((item, index) => {
        const ratio = ratios[index % ratios.length];
        const barHeight = ratio * (bottom - top);

        return (
          <LoadingReact
            x={xScale(item)}
            width={bandWidth}
            y={bottom - barHeight}
            height={height}
          />
        );
      })}
      <LoadingText x={left + width / 2} y={top + height / 2}>
        Loading data ...
      </LoadingText>
    </g>
  );
}

export default function PieArcLabel({value}) {
     const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  let cardWidth = 1200;
  let cardHeight = 350;
  let chartWidth = 350;
  let chartHeight = 300;

  if (isSmallScreen) {
    cardWidth = 300;
    cardHeight = 255;
    chartWidth = 275;
    chartHeight = 260;
  } else if (isMediumScreen) {
    cardWidth = 500;
    cardHeight = 300;
    chartWidth = 500;
    chartHeight = 200;
  } else if (isLargeScreen) {
    cardWidth = 300;
    cardHeight = 200;
    chartWidth = 420;
    chartHeight = 200;
  }
  const size = {
  width: chartWidth,
  height: chartHeight,
};

  const series = [
  {
    innerRadius: 50,
    outerRadius: 60,
    id: "series-2",
    data: value,
    size: size,
  },
];
  console.log(value)
  return (
    <Card sx={{height:cardHeight}}>
      <CardContent >
        <Typography sx={{ fontSize: 14 }} variant="div" color="text.secondary" gutterBottom>
          Image Categories
        </Typography>
       {

        value.length==0?<BarChart
          loading
          xAxis={[
            {
              scaleType: "band",
              data: ["A", "B", "C", "D", "E", "F", "G", "H"],
            },
          ]}
          slots={{ loadingOverlay: LoadingOverlay }}
          series={[]}
          margin={{ top: 0, right: 10, left: 25, bottom: 25 }}
          height={isMediumScreen || isSmallScreen?200:130}
          width={chartWidth}
      
          
        />
        :<PieChart
   series={series}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
          fontSize:13,
          marginBottom:1
        },
     
      }}
      {...size}
    />
       }
      </CardContent>
    </Card>
  );
}
