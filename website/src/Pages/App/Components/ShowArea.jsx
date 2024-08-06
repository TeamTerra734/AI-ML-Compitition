import React from 'react';
import cloudy from '../InsightScan/images/cloudy.png';
import leaf from '../InsightScan/images/leaf.png';
import water from '../InsightScan/images/water.png';
import desert from '../InsightScan/images/desert.png';

const classifications = {
  cloudy: { label: 'Cloudy', image: cloudy },
  green_area: { label: 'Green Area', image: leaf },
  desert: { label: 'Desert', image: desert },
  water: { label: 'Water', image: water },
};

const ClassificationComponent = ({ selectedCategories }) => {
  return (
        <div className="lightblue-container mt-5">
          <p className="Form-title" style={{ fontSize: '1rem', marginBottom: '0' }}>
            Classification of area : 
            <span className="svg-lb-container ms-3 me-2" style={{ transform: 'translateY(-3px)' }}>
              <img src={classifications[selectedCategories].image} alt={`${classifications[selectedCategories].label} Icon`} style={{ marginRight: '0' }} />
            </span>
            {classifications[selectedCategories].label}
          </p>
        </div>
  );
};

export default ClassificationComponent;
