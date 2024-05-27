import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SensorsPage.css';

function SensorsPage({ onVideoSelect }) {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]); // Store video list from backend
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [detections, setDetections] = useState([]);
  
  // Fetch the list of videos from the backend on component mount
  useEffect(() => {
    fetch('http://localhost:8001/list_videos')
      .then(response => response.json())
      .then(videoFilenames => {
        const videoObjects = videoFilenames.map((filename, index) => ({
          id: index + 1, // Simple id generation
          src: `http://localhost:8001/videos/${filename}`,
          name: filename,
        }));
        setVideos(videoObjects);
      })
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  const videoSelect = (video) => {
    setSelectedVideo(video);
    setSelectedVideoId(video.id); // Track the selected video's ID
    onVideoSelect(video); // Assuming this function is defined to handle the selected video
    setDetections([]);
  };

  const handleNavigateToML = () => {
    if (selectedVideo) {
      navigate('/ml-algorithms', { state: { selectedVideo } });
    } else {
      alert("Please select a video first.");
    }
  };
  

  const handleSelectCamera = (video) => {
    videoSelect(video); // Pass the entire video object to videoSelect
  };

  return (
    <div className='sensor-container'>
      <header className='sensor-header'>
        <h1>Select a Camera</h1>
      </header>
      <div className="cameras">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`camera ${selectedVideoId === video.id ? 'selected' : ''}`}
            onClick={() => handleSelectCamera(video)}
          >
            <video src={video.src} className="video" controls />
            <div className="cameraName">{video.name}</div>
          </div>
        ))}
      </div>
      <div className="navigation">
      <button className="sensor-button sensor-buttonExit" onClick={() => console.log('Exit')}>EXIT</button>

        <button className="sensor-button" onClick={handleNavigateToML}>NEXT →</button>
      </div>
    </div>
  );
  
}

export default SensorsPage;
