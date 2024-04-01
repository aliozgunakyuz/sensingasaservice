import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SensorsPage from './pages/SensorsPage';
import MLAlgorithmsPage from './pages/MLAlgorithmsPage';
import UploadAPI from './pages/UploadAPI';

function App() {
  // If selectedVideo state is not used elsewhere, you might not need it here.
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sensors" element={<SensorsPage onVideoSelect={setSelectedVideo} />} />
            <Route path="/ml-algorithms" element={<MLAlgorithmsPage />} />
            <Route path="/uploadapi" element={<UploadAPI />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
