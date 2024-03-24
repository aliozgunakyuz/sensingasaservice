import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MLAlgorithmsPage.css';
import { useLocation } from 'react-router-dom';

function MLAlgorithmsPage() {
    const location = useLocation();
    const selectedVideo = location.state?.selectedVideo;
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
      if (selectedVideo.src && selectedAlgorithm) {
          fetch(selectedVideo.src)
              .then(response => response.blob())
              .then(blob => {
                  const formData = new FormData();
                  // Create a file from the blob
                  const file = new File([blob], selectedVideo.name, { type: "video/mp4" });
                  formData.append('file', file);
                  console.log("Formdata Results:", formData);
                  // Now, send the formData to your video_processor
                  return fetch('http://localhost:5002/process_video', {
                      method: 'POST',
                      body: formData,
                  });
              })
              .then(response => response.json())
              .then(data => {
                  console.log("Processing Results:", data);
                  setDetections(data);
              })
              .catch(error => console.error('Error:', error));
      } else {
          console.error('No video selected or algorithm not selected');
      }
  };
  
  
  
  
   const handleSelectAlgorithm = (id) => {
    setSelectedAlgorithm(id);
  };

  const handleNext = () => {
    if (selectedAlgorithm && selectedVideo) {
        console.log('Selected Algorithm:', selectedAlgorithm);
        handleUpload(); // Trigger video processing and fetching results
    } else {
        console.error('No algorithm selected or no video selected');
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
          <div> {selectedVideo.src} </div>
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
