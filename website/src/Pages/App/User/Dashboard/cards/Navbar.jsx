import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import {useMediaQuery} from '@mui/material';
import { useState } from 'react';

// icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
   
const drawerWidth = 330;
let drawerHeight=1200


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({setPage,locationSet,changeLocation,selectLocation}) {
  console.log(selectLocation,"navbar")
console.log(locationSet,"locationset")
   
 const [selected, setSelected] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  if(isLargeScreen){
     drawerHeight=undefined
}
else if(isMediumScreen){
    drawerHeight=400
}
else if(isSmallScreen){
    drawerHeight=1200
}

  const [open, setOpen] = React.useState(false);
if(open){
  document.documentElement.style.setProperty("--zval",-1);
}
else{
  document.documentElement.style.setProperty("--zval",101);

}
  const handleDrawerOpen = () => {
    setOpen(true);
    
  };

  const handleDrawerClose = () => {
    setOpen(false);
  
  };


  return (
  <>
      <CssBaseline />
      <AppBar position="static" open={open}  >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) ,borderRadius:'5px'}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6"  noWrap component="div">
         DashBoard
         <AccountCircleOutlinedIcon sx={{position:"absolute",right:10,top:15}}/>
          </Typography>
            <div className="locationDropDown">
            <div className="input">
              <select name="" id="" onChange={changeLocation} value={selectLocation} >
                <option value="ALL">ALL</option>
                {
                 (locationSet.keys())?Array.from(locationSet.keys()).map((element,index)=>{
         return    (    <option key={element} value={element}>{element}</option>)

                  }):""
                }
              </select>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position:"absolute",
            height:drawerHeight,
            zIndex:100,
            top:"50px",
            height:"100%",
            

          },
    
        }}
        variant="persistent"
        anchor="left"
        open={open}
        className='drawer'
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List >
          {['Home', 'Table', 'About', 'Logout'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{cursor:"pointer"}} onClick={()=>{setPage(index) ;setSelected(index);}} 
            className={selected === index ? "menuItem active" : "menuItem"} 
            >
              <ListItemButton>
                <ListItemIcon>
                  {index  === 0 ? <HomeOutlinedIcon /> :index==1?<TableChartOutlinedIcon/>:index==3?<ExitToAppOutlinedIcon/>:<InfoOutlinedIcon/>}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
       
      
      </Main>
      
      </>

  );
}