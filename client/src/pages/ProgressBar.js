import React from "react";

const ProgressBar = (props) => {
    const { currentStep, totalSteps } = props;
  
    const containerStyles = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      marginTop: 80,
      marginRight: 80,
      marginBottom: 80,
      marginLeft: 2,
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
      color: 'white',
      fontWeight: 'bold'
    }
  
    return (
      <div style={{ padding: '5px 0' }}>
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>{`Step ${currentStep} of ${totalSteps}`}</span>
          </div>
        </div>
      </div>
    );
};

export default ProgressBar;
