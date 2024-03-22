import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SensorsPage.css';

function SensorsPage({ onVideoSelect }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const navigate = useNavigate();
  const [detections, setDetections] = useState([]);

  const videoSelect = (video) => {
    setSelectedVideo(video);
    setPreviewUrl(video.src); // Set the preview URL to the video's source
    setSelectedVideoId(video.id); // Track the selected video's ID
    onVideoSelect(video);
    setDetections([]);
  };
  
  const handleNavigateToML = () => {
    // Navigate to the ML Algorithms page
    navigate('/ml-algorithms');
  };

  const handleUpload = () => {
    if (selectedVideo) {
      fetch(selectedVideo.src)
        .then(response => response.blob())
        .then(blob => {
          const formData = new FormData();
          formData.append('file', new File([blob], selectedVideo.name, { type: 'mp4' }));

          return fetch('http://localhost:5001/upload_video', {
            method: 'POST',
            body: formData,
          });
        })
        .then(response => response.json())
        .then(data => {
          console.log("YOLO Results:", data);
          setDetections(data);
          // You might want to handle video detections differently
        })
        .catch(error => console.error('Error:', error));
    } else {
      console.error('No video selected');
    }
  };

  const [selectedCamera, setSelectedCamera] = useState(null);

  const handleSelectCamera = (camera) => {
    setSelectedCamera(camera);
  };

  // Update this list with your actual video data
  const videos = [
    { id: 1, src: 'http://localhost:5001/static/videos/YEMEKHANE.mp4', alt: 'Video 1', name: 'YEMEKHANE' },
    { id: 2, src: 'http://localhost:5001/static/videos/B12 YBF Otopark Nov 23.mp4', alt: 'Video 2', name: 'B12 YBF Otopark' },
    { id: 3, src: 'http://localhost:5001/static/videos/shortvideo.mp4', alt: 'Video 3', name: 'SERMET' },
  ];

  const preventPlay = (e) => {
    e.preventDefault();
    if (e.target.playing) {
      e.target.pause();
    }
  };
  
  return (
    <div className='container'>
      <header className='header'>
        <h1>Sensing as a Service</h1>
      </header>
      <div className="cameras">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`camera ${selectedCamera === video.id ? 'selected' : ''}`}
            onClick={() => handleSelectCamera(video.id)}
          >
            <video src={video.src} className="video" onClick={preventPlay} />
            <div className="cameraName">{video.name}</div>
          </div>
        ))}
      </div>
      <div className="navigation">
        <button className="button buttonExit" onClick={() => console.log('Exit')}>EXIT</button>
        <button className="button" onClick={() => handleNavigateToML}>NEXT →</button>
      </div>
    </div>
  );

}

export default SensorsPage;
