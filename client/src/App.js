import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DataPage from './pages/DataPage';
import DashboardPage from './pages/DashboardPage';
import SensorsPage from './pages/SensorsPage';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(null);

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log("YOLO Sonuçları:", data);
      setDetections(data); // YOLO sonuçlarını state'e kaydet
    })
    .catch(error => console.error('Hata:', error));
  };

  return (
    <Router>
      <div className="App">
      <NavigationBar />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/sensors" element={<SensorsPage onPictureSelect={setSelectedPicture} />} />
        </Routes>
      </main>


    </div>
    </Router>

  );
  
}

export default App;
