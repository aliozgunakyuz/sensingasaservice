import React, { useState, useEffect } from 'react';
import './UploadAPI.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CodeBlock from './CodeBlock';

function UploadAPI() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValues, setSubmittedValues] = useState([]);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [applet_id, setAppletID] = useState('');
  const [userChoice, setUserChoice] = useState(null); // Default choice is null
  const navigate = useNavigate();
  const location = useLocation();
  const detections = location.state?.detections;

  useEffect(() => {
    if (Array.isArray(detections?.results)) {
      const formattedDetections = detections.results.map(detection => JSON.stringify(detection, null, 2)).join('\n');
    } else {
      console.error('Detections is not an array:', detections);
    }
  }, [detections]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCodeInputChange = (value) => {
    setCodeInputValue(value);
    setInputValue(value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setSubmittedValues(previousValues => [...previousValues, inputValue.trim()]);
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleDeleteInput = (indexToDelete) => {
    setSubmittedValues(previousValues =>
      previousValues.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };



  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('in_file', selectedFile);
    formData.append('dependencies', submittedValues.join(' '));

    try {
      const response = await axios.post('http://localhost:5003/deployapi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Upload successful');
      console.log('Applet ID:', response.data.applet_id);
      setAppletID(response.data.applet_id);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleNext = async () => {
    if (detections && detections.results && Array.isArray(detections.results)) {
      const responsee = detections.results[detections.results.length - 1].response;

      if (!applet_id) {
        alert('Applet ID is not set');
        return;
      }

      const formattedData = responsee.map((detection, index) => ({
        name: `Detection ${index}`,
        value: {
          bbox: detection.bbox,
          class_name: detection.class_name,
          confidence: detection.confidence,
        },
      }));

      console.log("formattedData: ", formattedData);
      
  

      try {
        const url = `http://localhost:5003/get_inference/${applet_id}`;
        const response = await axios.post(url, { data: formattedData }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Execute API response:', response.data);
      } catch (error) {
        console.error('Error sending data to execute_api:', error);
        alert('Failed to send data to execute_api');
      }
    } else {
      console.error('Detections results not found or not an array');
    }  
  };

  const handleCodeWritingComplete = async () => {
    const trimmedCode = codeInputValue.trim();
    if (!trimmedCode) {
      alert('Please write some code before completing.');
      return;
    }
  
    const blob = new Blob([trimmedCode], { type: 'text/plain' });
  
    const file = new File([blob], 'script.py', { type: 'text/x-python' });
  
    handleFileSelection(file);
    handleSubmit();
  };
  
  const handleFileSelection = (file) => {
    setSelectedFile(file);
  };
  
  
  const handleUserChoice = (choice) => {
    setUserChoice(userChoice === choice ? null : choice);
    setCodeInputValue(''); // Reset code input value if user chooses to write code
    setSelectedFile(null); // Reset selected file if user chooses to upload file
  };

  return (
    <div className="sensing-service-page">
      <header className='header'>
        <h1>Upload API</h1>
      </header>
      <div className="choice-container">
        <button className={`button ${userChoice === 'writeCode' ? 'active' : ''}`} onClick={() => handleUserChoice('writeCode')}>
          Write Code
        </button>
        <button className={`button ${userChoice === 'uploadFile' ? 'active' : ''} upload-file-button`} onClick={() => handleUserChoice('uploadFile')}>
          Upload File
        </button>
      </div>

      {userChoice === 'writeCode' && (
        <>
        <div className="input-container">
            <input
              type="text"
              //value={inputValue}
              //onChange={handleInputChange}
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
            <CodeBlock onCodeInputChange={handleCodeInputChange} />
          </div>
        </>
      )}
      {userChoice === 'uploadFile' && (
        <div className="upload-button-container">
          <label htmlFor="file-input" className="file-input-label">
            Choose File
          </label>
          <input
            id="file-input"
            type="file"
            accept=".py"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <div className="file-info-container">
              <span>{selectedFile.name}</span>
              <button className="delete-file-button" onClick={() => setSelectedFile(null)}>
                Delete File
              </button>
            </div>
          )}
        </div>
      )}



      {userChoice && (
        <div className="footer">
        <button className="button" onClick={handleBack}>← BACK</button>
        {userChoice === 'uploadFile' && <button className="button" onClick={handleSubmit}>UPLOAD FILE</button>}
        {userChoice === 'writeCode' && <button className="button" onClick={handleCodeWritingComplete}>UPLOAD CODE</button>}
        <button className="button" onClick={handleNext}>NEXT →</button>
      </div>
      
      )}
    </div>
  );
}

export default UploadAPI;