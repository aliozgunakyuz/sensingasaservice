import React from "react";

const ProgressBar = (props) => {
    const { currentStep, totalSteps } = props;
  
    const containerStyles = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 50
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${(currentStep / totalSteps) * 100}%`,
      transition: 'width 1s ease-in-out',
      backgroundColor: '#007bff',
      borderRadius: 'inherit',
      textAlign: 'right'
    }
  
    const labelStyles = {
      padding: 5,
      color: 'white',
      fontWeight: 'bold'
    }
  
    return (
      <div style={{ padding: '20px 0' }}>
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>{`Step ${currentStep} of ${totalSteps}`}</span>
          </div>
        </div>
      </div>
    );
};

export default ProgressBar;
