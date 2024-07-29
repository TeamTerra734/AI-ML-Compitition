import React from 'react';
//routing...
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Link
}from 'react-router-dom';

//pages
import AppLayout from './AppLayout/AppLayout';
import Error_404 from './Pages/Error/Error_404/Error_404';
import Error_500 from './Pages/Error/Error_500/Error_500';
import Home from './Pages/App/Home/Home';
import InsightScan from './Pages/App/InsightScan/InsightScan';
import User from './Pages/App/User/User';
import AddData from './Pages/App/User/AddData/AddData';
import UserInsightScan from './Pages/App/User/InsightScan/UserInsightScan';
import Dashboard from './Pages/App/User/Dashboard/DashBoard';
//css files
import './main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';




// router and routes
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error_500 />,

    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },

      {
        path: "/InsightScan",
        element: <InsightScan />,
      },

      {
        path: "/User",
        element: <User/>,
        children:[
          {
            path: "/User/AddData",
            index: true,
            element: <AddData/>,
          },
          {
            path: "/User/InsightScan",
            element:<UserInsightScan/>
          },
          {
            path: "/User/Dashboard",
            element: <Dashboard/>
          }
        ]
      },

      {
        path: "*",
        element: <Error_404 />
      },
    ]
  }
]
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

