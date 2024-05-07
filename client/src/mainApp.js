import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import ProgressBar from './pages/ProgressBar';
import DashboardPage from './pages/DashboardPage';
import SensorsPage from './pages/SensorsPage';
import MLAlgorithmsPage from './pages/MLAlgorithmsPage';
import UploadAPI from './pages/UploadAPI';
import './mainApp.css';
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'

const MainApp = ({ setSelectedVideo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/sensors':
        setCurrentStep(1);
        break;
      case '/ml-algorithms':
        setCurrentStep(2);
        break;
      case '/uploadapi':
        setCurrentStep(3);
        break;
      default:
        setCurrentStep(0);
        break;
    }
  }, [location]);


  return (

      <div>
        <NavigationBar />
        <Sidebar />
        <ProgressBar currentStep={currentStep} totalSteps={3} />
        <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/sensors" element={
              
                  <SensorsPage onVideoSelect={setSelectedVideo} />
                
              } />
              <Route path="/ml-algorithms" element={<MLAlgorithmsPage />} />
              <Route path="/uploadapi" element={<UploadAPI />} />
            </Routes>
        </main>
      </div>

  );
};

export default MainApp;
