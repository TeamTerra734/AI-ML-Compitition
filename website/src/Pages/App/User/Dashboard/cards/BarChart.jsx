import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import {Card} from '@mui/material';
import {CardContent} from '@mui/material';
import {useTheme} from '@mui/material';

import {useMediaQuery} from '@mui/material';
import {Typography} from '@mui/material';
export default function BarLabel({barData}) {
       const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  let cardWidth = 1200;
  let cardHeight = 350;
  let chartWidth = 350;
  let chartHeight = 300;

  if (isSmallScreen) {
    cardWidth = 310;
    cardHeight = 255;
    chartWidth = 315;
    chartHeight = 230;
  } else if (isMediumScreen) {
    cardWidth = 500;
    cardHeight = 300;
    chartWidth = 500;
    chartHeight = 200;
  } else if (isLargeScreen) {
    cardWidth = 420;
    cardHeight = 200;
    chartWidth = 400;
    chartHeight = 180;
  }
  return (
      <Card sx={{height:cardHeight,width:cardWidth}}>
        <CardContent>

 <Typography sx={{ fontSize: 14 }} variant="div" color="text.secondary" gutterBottom>
         IOT Categories
        </Typography>
    <BarChart
      xAxis={[{ scaleType: 'band', data: ["Good","Moderate","Unhealthy_for_Sensitive_Groups","Unhealthy","Very_Unhealthy","Severe"] }]}
      series={[{data:barData}]}
      width={chartWidth}
      height={chartHeight}
      sx={{overflowX:"auto"}}
      barLabel="value"
    />
        </CardContent>
      </Card>
  );
}