import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContex.js';
import ConfirmModal from '../components/Popup.js'; // Import the ConfirmModal component
import './AuthenticatedDashboardPage.css';

const AuthenticatedDashboardPage = () => {
  const [pipelines, setPipelines] = useState([]);
  const { user, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        if (!token) {
          return;
        }
  
        const response = await axios.get('http://localhost:8001/api/user_pipelines', {
          headers: {
            'auth-token': token
          }
        });
  
        setPipelines(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error response from server:', error.response.data);
          console.error('Status code:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }
    };
  
    if (user) {
      fetchPipelines();
    }
  }, [user, token]);
  

  const deletePipeline = async (pipelineId) => {
    try {
      await axios.delete(`http://localhost:8001/api/delete_pipeline/${pipelineId}`, {
        headers: {
          'auth-token': token
        }
      });
      setPipelines(pipelines.filter(pipeline => pipeline._id !== pipelineId));
    } catch (error) {
      console.error('Error deleting pipeline:', error);
    }
  };

  const openModal = (message, pipeline = null) => {
    setModalMessage(message);
    setSelectedPipeline(pipeline);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPipeline(null);
    setModalMessage('');
  };

  const confirmDelete = () => {
    if (selectedPipeline) {
      deletePipeline(selectedPipeline._id);
      closeModal();
    }
  };

  const checkDatabase = async (camList, mlModelList) => {
    const response = await fetch('http://localhost:8001/api/results/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelname: mlModelList[0],
        camname: camList[0],
      }),
    });

    const data = await response.json();
    return data;
  };

  const handleUploadAPI = async (results, appletID, pythonCode) => {
    const standardizedResults = results.results || results.response || results;

    console.log(results);
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

    } catch (error) {
      console.error('Error sending data to execute_api:', error);
      alert('Failed to send data to execute_api');
    }
  };

  const executePipeline = async (appletName, camList, mlModelList, pythonCode, appletID) => {
    console.log('Executing pipeline:', appletName, camList[0], mlModelList, pythonCode);
    const checkData = await checkDatabase(camList, mlModelList);
    const results = checkData.results;

    console.log(appletID);
    await handleUploadAPI(results, appletID, pythonCode);
  };

  const handleFinish = async (pipelineName) => {
    if (!pipelineName.trim()) {
      openModal('Please give a pipeline name.');
      return;
    }

    // Proceed with the logic to handle the pipeline name provided
    console.log('Pipeline name:', pipelineName);
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard, {user?.fullname}</h1>
      <h2>Your Pipelines</h2>
      <div className="pipelines-container">
        {pipelines.map(pipeline => (
          <div key={pipeline._id} className="pipeline-card">
            <h3>{pipeline.appletName}</h3>
            <p><strong>Camera List:</strong> {pipeline.camList.join(', ')}</p>
            <p><strong>ML Model List:</strong> {pipeline.mlModelList.join(', ')}</p>
            <button
              className="execute-button"
              onClick={() => executePipeline(pipeline.appletName, pipeline.camList, pipeline.mlModelList, pipeline.pythonCode, pipeline.appletId)}
            >
              Execute Pipeline
            </button>
            <button
              className="delete-button"
              onClick={() => openModal(`Do you want to delete ${pipeline.appletName}?`, pipeline)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onConfirm={selectedPipeline ? confirmDelete : closeModal}
        message={modalMessage}
        showCancelButton={true}
      />
    </div>
  );
};

export default AuthenticatedDashboardPage;
