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
      { id: 'algorithm2', name: 'Emotion Detection' },
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
      return new Promise((resolve, reject) => {
        if (selectedVideo.src && selectedAlgorithm) {
          // First, check if the results already exist in the database
          fetch(`http://localhost:8001/api/results/check`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              modelname: selectedAlgorithm,
              camname: selectedVideo.name,
            }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.exists && data.results) {
              // If results exist, set detections to existing results
              console.log("Fetching results from database:", data.results);
              setDetections(data.results);
              resolve(data.results);
            } else {
              // If not, proceed to run Docker and process the video
              console.log("No existing data found, processing video...");
              fetch(selectedVideo.src)
              .then(response => response.blob())
              .then(blob => {
                const formData = new FormData();
                const file = new File([blob], selectedVideo.name, { type: "video/mp4" });
                formData.append('file', file);
                return fetch('http://localhost:5002/process_video', {
                  method: 'POST',
                  body: formData,
                });
              })
              .then(response => response.json())
              .then(newData => {
                console.log("Processing Results:", newData);
                // Save new results to database
                fetch('http://localhost:8001/api/results/save', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    modelname: selectedAlgorithm,
                    camname: selectedVideo.name,
                    results: newData,
                  }),
                })
                .then(() => {
                  setDetections(newData);
                  resolve(newData);
                })
                .catch(error => {
                  console.error('Error saving results to database:', error);
                  reject(error);
                });
              })
              .catch(error => {
                console.error('Error processing video:', error);
                reject(error);
              });
            }
          })
          .catch(error => {
            console.error('Error checking database:', error);
            reject(error);
          });
        } else {
          console.error('No video selected or algorithm not selected');
          reject('No video selected or algorithm not selected');
        }
      });
    };
    
    
    const handleNext = async () => {
      if (selectedAlgorithm && selectedVideo) {
          console.log('Selected Algorithm:', selectedAlgorithm);
          try {
              const detectionsData = await handleUpload(); // Wait for the processing results
              console.log('About to navigate with detections:', detectionsData);
              navigate('/uploadapi', { state: { detections: detectionsData, selectedVideo } });
          } catch (error) {
              alert('Failed to process video.');
              console.error(error);
          }
      } else {
          alert("Please select an algorithm first.");
      }
    };
    
  
   const handleSelectAlgorithm = (id) => {
    setSelectedAlgorithm(id);
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
        <main className="algorithm-selection">
          <header className='header'>
            <h1>Select Your Algorithm</h1>
          </header>
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
          <div className="navigation">
            <button className="button" onClick={handleBack}>← BACK</button>
            <button className="button" onClick={handleNext}>NEXT →</button>
          </div>
        </main>
        
      </div>
    );
}

export default MLAlgorithmsPage;
