import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { Typography } from '@mui/material';
import {useTheme} from '@mui/material';
import { format } from 'date-fns'; 
import {useMediaQuery} from '@mui/material';

export default function MarkOptimization({lineChart}) {


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
    cardHeight = 360;
    chartWidth = 310;
    chartHeight = 300;
  } else if (isMediumScreen) {
    cardWidth = 600;
    cardHeight = 300;
    chartWidth = 600;
    chartHeight = 260;
  } else if (isLargeScreen) {
    cardWidth = 1200;
    cardHeight = 330;
    chartWidth = 1200;
    chartHeight = 280;
  }
  let xaxisObj={
    label: "Date And Time",
              type: 'date',
                data:lineChart.dates,
          valueFormatter: (value) =>  format(value, 'yyyy MMM dd'),

  }
  if(lineChart.dates.length==0)
  {

 xaxisObj={
 label: "Date And Time",
              type: 'date',
                data:lineChart.dates,
        
}
  }

  return (
    <Card sx={{ width: cardWidth ,height:cardHeight}} >
        <CardContent>
  <Typography sx={{ fontSize: 14 }} color="text.secondary" variant="div" gutterBottom>
          TIME V/S Deforestation And Air Pollution(%)
        </Typography>

    <LineChart
      xAxis={
        [
        xaxisObj
        ]
        }
    yAxis={[
        {
            label:"Probability"
        }
    ]}
    title='TIME V/S Deforestation And Air Pollution Probability'
      series={[
        {
           curve: "monotoneX",data: lineChart.deforestation ,
         color:'#e7be5b',
          showMark: ({ index }) => index % 2 === 0,
          label:"Deforestation",
          
          
        },
        {
          curve: "monotoneX", data: lineChart.airPollution, 
          label:"Air Pollution"

        },
    
      ]}
 
      width={chartWidth}
      height={chartHeight}
      
    />
        </CardContent>
    </Card>
  );
}