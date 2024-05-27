import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pipeline.css';
import CodeBlock from './CodeBlock';
import WalkthroughModal from '../components/WalkthroughModal';
import axios from 'axios';
import { useAuth } from '../components/AuthContex.js';  // Ensure this path is correct

function Pipeline() {
  const navigate = useNavigate();
  const { getUserId, token } = useAuth();  // Get user ID and token from AuthContext
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [detections, setDetections] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [submittedValues, setSubmittedValues] = useState([]);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [applet_id, setAppletID] = useState('');
  const [userChoice, setUserChoice] = useState(null);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [pipelineName, setPipelineName] = useState(''); // New state for pipeline name

  const userId = getUserId();  // Get the user ID

  // Example codes
  const personCountCode = `# personCount.py example code
  def execute(**kwargs):
    
    total_person_count = 0
    for key, value in kwargs.items():
      if isinstance(value, dict) and value.get('class_name') == 'person':
        total_person_count += 1

    return total_person_count`;

  const carCountCode = `# carCount.py example code
  def execute(**kwargs):

    total_car_count = 0

    for key, value in kwargs.items():
      if isinstance(value, dict) and value.get('class_name') == 'car':
          total_car_count += 1

    return total_car_count`;

  const algorithms = [
    { id: 'yolo', name: 'YOLO' },
    { id: 'algorithm2', name: 'Emotion Detection' },
    { id: 'algorithm3', name: 'CNN' },
    { id: 'algorithm4', name: 'RNN' },
    { id: 'algorithm5', name: 'OpenPose' },
    { id: 'algorithm6', name: 'Autoencoder' },
    { id: 'algorithm7', name: 'Generative Adversarial Networks' },
    { id: 'algorithm8', name: 'Super-Resolution Convolutional Neural Network' },
  ];

  useEffect(() => {
    fetch('http://localhost:8001/list_videos')
      .then(response => response.json())
      .then(videoFilenames => {
        const videoObjects = videoFilenames.map((filename, index) => ({
          id: index + 1,
          src: `http://localhost:8001/videos/${filename}`,
          name: filename,
        }));
        setVideos(videoObjects);
      })
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  const checkDatabase = async () => {
    const response = await fetch('http://localhost:8001/api/results/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelname: selectedAlgorithm,
        camname: selectedVideo.name,
      }),
    });

    const data = await response.json();
    return data;
  };

  const processVideo = async () => {
    const response = await fetch(selectedVideo.src);
    const blob = await response.blob();

    const formData = new FormData();
    const file = new File([blob], selectedVideo.name, { type: 'video/mp4' });
    formData.append('file', file);

    const processResponse = await fetch('http://localhost:5002/process_video', {
      method: 'POST',
      body: formData,
    });

    const processData = await processResponse.json();
    return processData;
  };

  const saveResultsToDatabase = async (results) => {
    await fetch('http://localhost:8001/api/results/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelname: selectedAlgorithm,
        camname: selectedVideo.name,
        results,
      }),
    });
  };

  const handleUploadAPI = async (results, appletID) => {
    const standardizedResults = results.results || results.response || results;

    if (!standardizedResults || !Array.isArray(standardizedResults)) {
      console.error('Invalid results data:', results);
      throw new Error('Invalid results data');
    }

    const formattedData = standardizedResults.map((detection, index) => ({
      name: `Detection ${index}`,
      value: {
        bbox: detection.bbox,
        class_name: detection.class_name,
        confidence: detection.confidence,
      },
    }));

    try {
      console.log('applet id', appletID);
      const url = `http://localhost:5003/get_inference/${appletID}`;
      const response = await axios.post(url, { data: formattedData }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Execute API response:', response.data);

      // Save pipeline data to the database
      await savePipelineData(appletID, response.data);

    } catch (error) {
      console.error('Error sending data to execute_api:', error);
      alert('Failed to send data to execute_api');
    }
  };

  const savePipelineData = async (appletID, apiResponse) => {
    try {
      const response = await axios.post('http://localhost:8001/api/save_pipeline', {
        appletName: pipelineName,
        appletId: appletID,
        camList: [selectedVideo.name],
        mlModelList: [selectedAlgorithm],
        userId: userId // Use the actual user ID
      }, {
        headers: {
          'auth-token': token,  // Include the token in the request headers
        }
      });

      if (response.status === 200) {
        console.log('Pipeline saved successfully');
        navigate('/dashboard'); // Redirect to dashboard after saving
      } else {
        console.error('Failed to save pipeline:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error saving pipeline:', error);
    }
  };

  const handleFinish = async () => {
    try {
      // Check database for existing results
      const checkData = await checkDatabase();

      let results;
      if (checkData.exists && checkData.results) {
        console.log('Fetching results from database:', checkData.results);
        results = checkData.results;
      } else {
        // Process video if results not found
        console.log('No existing data found, processing video...');
        results = await processVideo();

        // Save new results to database
        await saveResultsToDatabase(results);
      }

      let appletID;

      // Ensure handleSubmit or handleCodeWritingComplete completes before proceeding
      if (userChoice === 'writeCode') {
        appletID = await handleCodeWritingComplete();
      } else {
        appletID = await handleSubmit();
      }

      // Handle API upload
      await handleUploadAPI(results, appletID);

    } catch (error) {
      alert('Failed to process video.');
      console.error(error);
    }
  };

  const handleSelectAlgorithm = (id) => {
    setSelectedAlgorithm(id);
  };

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile && userChoice !== 'writeCode') {
      alert('Please select a file to upload');
      return null;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append('in_file', selectedFile);
    } else if (userChoice === 'writeCode') {
      const blob = new Blob([codeInputValue.trim()], { type: 'text/plain' });
      const file = new File([blob], 'script.py', { type: 'text/x-python' });
      formData.append('in_file', file);
    }
    formData.append('dependencies', submittedValues.join(' '));

    try {
      const response = await axios.post('http://localhost:5003/deployapi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Upload successful');
      console.log('Applet ID:', response.data.applet_id);
      setAppletID(response.data.applet_id);
      return response.data.applet_id; // Return the applet_id
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
      return null;
    }
  };

  const handleCodeWritingComplete = async () => {
    const trimmedCode = codeInputValue.trim();
    if (!trimmedCode) {
      alert('Please write some code before completing.');
      return null;
    }

    const blob = new Blob([trimmedCode], { type: 'text/plain' });

    const file = new File([blob], 'script.py', { type: 'text/x-python' });

    handleFileSelection(file);
    return handleSubmit();
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
  };

  const handleUserChoice = (choice) => {
    setUserChoice(userChoice === choice ? null : choice);
    setCodeInputValue('');
    setSelectedFile(null);
  };

  const handleExampleChange = (event) => {
    const selectedExample = event.target.value;
    if (selectedExample === 'personCount') {
      setCodeInputValue(personCountCode);
    } else if (selectedExample === 'carCount') {
      setCodeInputValue(carCountCode);
    }
  };

  const handleWalkthroughNext = () => {
    if (walkthroughStep < 5) {
      setWalkthroughStep(walkthroughStep + 1);
    } else {
      setShowWalkthrough(false);
    }
  };

  const handleWalkthroughPrevious = () => {
    if (walkthroughStep > 0) {
      setWalkthroughStep(walkthroughStep - 1);
    }
  };

  const handlePipelineNameChange = (event) => {
    setPipelineName(event.target.value);
  };

  return (
    <div className="pipeline-container">
      <header className="header">
        <h1>Create a Pipeline</h1>
      </header>
      {showWalkthrough && (
        <WalkthroughModal
          step={walkthroughStep}
          onNext={handleWalkthroughNext}
          onPrevious={handleWalkthroughPrevious}
          onClose={() => setShowWalkthrough(false)}
        />
      )}
      <div className="pipeline-section">
        <label htmlFor="pipeline-name">Pipeline Name</label>
        <input
          id="pipeline-name"
          type="text"
          value={pipelineName}
          onChange={handlePipelineNameChange}
          className="pipeline-input"
          placeholder="Enter pipeline name"
        />
      </div>
      <div className="pipeline-section">
        <h2>Select a Camera</h2>
        <div className="cameras">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`camera ${selectedVideoId === video.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedVideo(video);
                setSelectedVideoId(video.id);
              }}
            >
              <video src={video.src} className="video" controls />
              <div className="cameraName">{video.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="pipeline-section">
        <h2>Select Your Algorithm</h2>
        <div className="algorithms">
          {algorithms.map((algo) => (
            <div
              key={algo.id}
              className={`algorithm ${selectedAlgorithm === algo.id ? 'selected' : ''}`}
              onClick={() => handleSelectAlgorithm(algo.id)}
            >
              {algo.name}
            </div>
          ))}
        </div>
      </div>
      <div className="pipeline-section">
        <h2>Upload API               
        <button className="button2" onClick={() => setShowWalkthrough(true)}>Help</button>
        </h2>
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
              <label htmlFor="exampleSelect">Select an Example: </label>
              <select id="exampleSelect" onChange={handleExampleChange}>
                <option value="">--Choose an example--</option>
                <option value="personCount">PersonCount</option>
                <option value="carCount">CarCount</option>
              </select>
              <CodeBlock onCodeInputChange={handleCodeInputChange} codeValue={codeInputValue} />
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
      </div>
      <div className="footer">
        <button className="button" onClick={handleFinish}>Finish</button>
      </div>
    </div>
  );
}

export default Pipeline;