import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MLAlgorithmsPage.css';

function MLAlgorithmsPage({ selectedVideo }) {
    const [results, setResults] = useState(null);
    const [detections, setDetections] = useState([]);
    const [videoURL, setVideoURL] = useState(''); // Assuming you'll provide a way to access the processed video
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const navigate = useNavigate();

    const algorithms = [
      { id: 'yolo', name: 'YOLO' },
      { id: 'algorithm2', name: 'Algorithm 2' },
      { id: 'algorithm3', name: 'Algorithm 3' },
      { id: 'algorithm4', name: 'Algorithm 4' },
      { id: 'algorithm5', name: 'Algorithm 5' },
      { id: 'algorithm6', name: 'Algorithm 6' },
  ];
    
    const handleAlgorithmChange = (e) => {
        setSelectedAlgorithm(e.target.value);
        // Optionally reset results when algorithm changes
        setResults(null);
        setDetections([]); // Reset detections when changing algorithms
    };

    const handleUpload = () => {
      if (selectedVideo && selectedAlgorithm === 'YOLO') {
          const formData = new FormData();
          formData.append('file', selectedVideo); // Assuming selectedVideo is a File object
  
          fetch('http://localhost:5001/upload_video', { // Make sure this matches your Flask route
              method: 'POST',
              body: formData,
          })
          .then(response => response.json())
          .then(data => {
              console.log("YOLO Results:", data);
              setDetections(data);
              // setVideoURL(data.processedVideoURL); // Assuming the backend sends back a URL to the processed video
          })
          .catch(error => console.error('Error:', error));
      } else {
          console.error('No video selected or algorithm not supported');
      }
   };
  
   const handleSelectAlgorithm = (id) => {
    setSelectedAlgorithm(id);
  };

  const handleNext = () => {
    if (selectedAlgorithm) {
      // Add logic for when the 'NEXT' button is pressed after an algorithm is selected
      console.log('Selected Algorithm:', selectedAlgorithm);
      // navigate to the results page or processing page
    } else {
      console.error('No algorithm selected');
    }
  };

  const handleBack = () => {
    // navigate back to the video selection page
    navigate(-1);
  };
  
    const handleSeeResults = () => {
        console.log(`Results for ${selectedAlgorithm}`);
        handleUpload(); // Trigger video processing and fetching results
    };

    useEffect(() => {
        // This could be where you manage fetching a pre-processed video URL or additional logic based on the selected algorithm
    }, [selectedAlgorithm]);

    return (
      <div className='ml-page-container'>
        <header className='header'>
          <h1>Sensing as a Service</h1>
        </header>
        <main className="algorithm-selection">
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
        </main>
        <div className="navigation">
          <button className="button" onClick={handleBack}>← BACK</button>
          <button className="button" onClick={handleNext}>NEXT →</button>
        </div>
      </div>
    );
}

export default MLAlgorithmsPage;
