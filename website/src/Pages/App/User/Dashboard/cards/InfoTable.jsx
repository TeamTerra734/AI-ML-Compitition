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

function setInLimit(val){
  if(val>=0.60){
    return "HIGH"
  }
  else if(val>=0.35){
    return "MEDIUM"
  }
  return "LOW";
}
// slash_burn']
// 2
// : 
// (2) [0.0586, 'habitation']
// 3
// : 
// (2) [0.0287, 'agriculture']
// 4
// : 
// (2) [0.0209, 'bare_ground']
// 5
// : 
// (2) [0.0195, 'blow_down']
// 6
// : 
// (2) [0.0009, 'conventional_mine']
// 7
// : 
// (2) [0.0001, 'artisinal_mine']

table.forEach((element,index)=>{
let obj={
  id:index,
  image:element.image_url,
  Date:element.Date,
  Location:element.location,
  Agriculture:setInLimit(element.Deforestation),
  Slash_burn:setInLimit(element.slash_burn),
  Habitation:setInLimit(element.habitation),
  Bare_Ground:setInLimit(element.bare_ground),
  Blow_Down:setInLimit(element.blow_down),
  Conventional_Mine:setInLimit(element.conventional_mine),
  Artisinal_Mine:setInLimit(element.artisinal_mine),
  Selective_Logging:setInLimit(element.selective_logging),
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
    field: 'Agriculture',
    type: 'string',
    width: 170
  },

   {
    field: 'Slash_burn',
    type: 'string',
    width: 170
  }, 
  {
    field: 'Habitation',
    type: 'string',
    width: 170
  }, {
    field: 'Bare_Ground',
    type: 'string',
    width: 170
  }, {
    field: 'Blow_Down',
    type: 'string',
    width: 170
  }, {
    field: 'Conventional_Mine',
    type: 'string',
    width: 170
  },
  {
    field: 'Artisinal_Mine',
    type: 'string',
    width: 170
  },
  {
    field: 'Selective_Logging',
    type: 'string',
    width: 170
  },
 
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
