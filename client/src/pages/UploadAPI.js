import React, { useState } from 'react';
import './UploadAPI.css';
import { useNavigate } from 'react-router-dom';


function UploadAPI() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValues, setSubmittedValues] = useState([]);
  const [codeInputValue, setCodeInputValue] = useState('');
  const navigate = useNavigate();


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCodeInputChange = (event) => {
    setCodeInputValue(event.target.value);
  };

  const lineNumberString = () => {
    const numberOfLines = codeInputValue.split('\n').length;
    return Array.from({ length: numberOfLines }, (_, index) => index + 1).join('\n');
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setSubmittedValues(previousValues => [...previousValues, inputValue.trim()]);
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleDeleteInput = (indexToDelete) => {
    setSubmittedValues((previousValues) =>
      previousValues.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const countLines = (text) => {
    return text.split('\n').length;
  };



  return (
    <div className="sensing-service-page">
      <header className='header'>
        <h1>Upload API</h1>
      </header>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder="Enter library names and press enter"
        />
      </div>
      <div className="submitted-values-container">
        {submittedValues.map((value, index) => (
          <div key={index} className="submitted-value" onClick={() => handleDeleteInput(index)}>
            {value}
          </div>
        ))}
      </div>
      <div className="content">
      <div className="line-numbers">
        <pre>{lineNumberString()}</pre>
      </div>
      <textarea
        className="code-input"
        value={codeInputValue}
        onChange={handleCodeInputChange}
        rows="25"
        placeholder="Paste your API code here..."
      ></textarea>
    </div>
      <div className="footer">
        <button className="button" onClick={handleBack}>← BACK</button>
        <button className="button">NEXT →</button>
      </div>
    </div>
  );
}

export default UploadAPI;
