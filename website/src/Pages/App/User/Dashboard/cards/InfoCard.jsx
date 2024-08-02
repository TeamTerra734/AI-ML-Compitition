import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InsightsIcon from '@mui/icons-material/Insights';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';

import {useTheme} from '@mui/material';

import {useMediaQuery} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';




export default function BasicCard({count}) {
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
    cardHeight = 200;
    chartWidth = 275;
    chartHeight = 200;
  } else if (isMediumScreen) {
    cardWidth = 530;
    cardHeight = 270;
    chartWidth = 600;
    chartHeight = 300;
  } else if (isLargeScreen) {
    cardWidth = 420;
    cardHeight = 200;
    chartWidth = 200;
    chartHeight = 300;
  }

  return (
    <Card sx={{ width: cardWidth ,height:cardHeight}} className='card-item'>
      <CardContent>
      
       <Typography sx={{ fontSize: 14 }} color="text.secondary" variant="div" gutterBottom>
         EcoGen
        </Typography>
        <Typography variant="h5"  sx={{ mb: 1.8 }} component="div">
         Total Images
        </Typography>
        
            <div className="" style={{'display':'flex','alignItems':'center'}}>
        <Typography variant="body2" >
{count==undefined? <LoadingButton  loading >
      </LoadingButton>:count }
           </Typography>
          <InsightsIcon color='primary'/>
            </div>

            <ThumbUpAltOutlinedIcon color="primary" sx={{mr:42,mt:5}}/>
            <ThumbDownOffAltOutlinedIcon color="primary" sx={{mt:5}}/>
       

      </CardContent>
     
    </Card>
  );
}
