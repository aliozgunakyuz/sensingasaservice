import React, { useState, useEffect } from 'react';
import './UploadAPI.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function UploadAPI() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValues, setSubmittedValues] = useState([]);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const detections = location.state?.detections;
  const selectedVideo = location.state?.selectedVideo;
  const [applet_id, setAppletID] = useState('');


  useEffect(() => {
    if (Array.isArray(detections.results)) {
      const formattedDetections = detections.results.map(detection => JSON.stringify(detection, null, 2)).join('\n');
      setCodeInputValue(formattedDetections);
    } else {
      console.error('Detections is not an array:', detections);
    }
  }, [detections]);
  
  

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
    formData.append('dependencies', submittedValues.join(' '));  // Assuming dependencies are stored in submittedValues

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
        <textarea
          className="code-input"
          value={codeInputValue}
          onChange={handleCodeInputChange}
          rows="25"
          placeholder="Detection results will appear here..."
        ></textarea>
      </div>
      <div className="upload-button-container">
        <input
          type="file"
          accept=".py"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      <div className="footer">
        <button className="button" onClick={handleBack}>← BACK</button>
        <button className="button" onClick={handleSubmit}>UPLOAD</button>
        <button className="button" onClick={handleNext}>NEXT →</button>

      </div>
    </div>
  );
}

export default UploadAPI;
