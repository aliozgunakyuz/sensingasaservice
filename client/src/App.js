import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DataPage from './pages/DataPage';
import DashboardPage from './pages/DashboardPage';
import SensorsPage from './pages/SensorsPage';
import MLAlgorithmsPage from './pages/MLAlgorithmsPage';

function App() {
  const [selectedPicture, setSelectedPicture] = useState(null);


  return (
    <Router>
      <div className="App">
      <NavigationBar />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/sensors" element={<SensorsPage onPictureSelect={setSelectedPicture} />} />
          <Route path="/ml-algorithms" element={<MLAlgorithmsPage selectedPicture={selectedPicture} />} />
        </Routes>
      </main>


    </div>
    </Router>

  );
  
}

export default App;
