import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { format } from 'date-fns'; 


const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});


export default function InfoTable({table}) {
const rows = [


];
// 'image_url':image_url?image_url:"Not Availabel",
//             'Date':date?new Date(date):"00-00-00",
//             'location':location?location:"Not Availabel",
//             'Deforestation':deforestationProbability?deforestationProbability:NaN,
//             'AirPollution':airPollutionProbability?airPollutionProbability:NaN,
//             'ImageCategory':areaClassification?areaClassification:"Not Availabel",
//             'IotCategory':airQualityClassification?airQualityClassification:"Not Availabel"
table.forEach((element,index)=>{
let obj={
  id:index,
  image:element.image_url,
  Date:element.Date,
  Location:element.location,
  Deforestation:element.Deforestation,
  AirPollution:element.AirPollution,
  ImageCategories:element.ImageCategory,
  IOTCategories:element.IotCategory,
  Button:"Rmv"
}
rows.push(obj)
})
const columns = [
  {
    field:'image',  
      renderCell: (params) => {
      return (
        <img src={params.row.image} alt="Product Image" width="120px" style={{ maxWidth: '100%' ,"textAlign":"center"}} />
      );
    }, 
    width:200
  },

  {
    field: 'Date',
    type: 'date',
    width: 170,
    valueFormatter: (value) =>  format(value, 'yyyy MMM dd'),
  },
  { field: 'Location',type:"string", width: 170 },
  {
    field: 'Deforestation',
    type: 'numeric',
    width: 170
  },
  {
    field:'AirPollution',
    type: 'numeric',
    width: 170

  }
  ,
  {
    field:"ImageCategories",
    type:"string",
    width: 170
  },
   {
    field:"IOTCategories",
    type:"string",
    width:170
  },
    {
    field:"Button",
    type:"string",
    width:150
  }

];
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [''],
  });
  const [ignoreDiacritics, setIgnoreDiacritics] = useState(true);

  return (
    <div style={{ width: '100%'}}>
    
      <div style={{ width: '100%' ,height:'auto',maxHeight:'500px',overflowY:"auto" }}>
        <DataGrid
          key={ignoreDiacritics.toString()}
          rows={rows}
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
       
          disableDensitySelector
          hideFooter
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          ignoreDiacritics={ignoreDiacritics}
    
        />
      </div>
    </div>
  );
}
