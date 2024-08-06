import React from 'react';

// Mapping of category to descriptive labels
const categoryLabels = {
  agriculture: 'Agriculture',
  artisinal_mine: 'Artisanal Mine',
  bare_ground: 'Bare Ground',
  blow_down: 'Blow Down',
  conventional_mine: 'Conventional Mine',
  habitation: 'Habitation',
  selective_logging: 'Selective Logging',
  slash_burn: 'Slash and Burn'
};

const StatusTable = ({ prob_array }) => {
  // Function to determine the badge class based on probability
  
  const getBadgeClass = (probability) => {
    if (probability >= 0.60) return 'bg-success'; // High (Green)
    if (probability >= 0.35) return 'bg-warning'; // Mid (Yellow)
    return 'bg-danger'; // Low (Red)
  };

  // Function to determine the chances label based on probability
  const getChancesText = (probability) => {
    if (probability >= 0.60) return 'High';
    if (probability >= 0.35) return 'Mid';
    return 'Low';
  };

  return (
    <div className='scroll-small'>
      <table className="table table-bordered table-hover mytable">
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Chances</th>
          </tr>
        </thead>
        <tbody>
          {prob_array.slice(0, 3).map((item, index) => (
            <tr key={index}>
              <td>{categoryLabels[item[1]] || item[1]}</td> {/* Display the label or the category name */}
              <td>
                <span className={`badge rounded-pill ${getBadgeClass(item[0])}`}>
                  {getChancesText(item[0])}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatusTable;
