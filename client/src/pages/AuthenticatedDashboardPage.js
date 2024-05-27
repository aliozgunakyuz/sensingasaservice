import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContex.js';
import './AuthenticatedDashboardPage.css';

const AuthenticatedDashboardPage = () => {
  const [pipelines, setPipelines] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/user_pipelines', {
          headers: {
            'auth-token': token
          }
        });
        setPipelines(response.data);
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      }
    };

    if (user) {
      fetchPipelines();
    }
  }, [user, token]);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthenticatedDashboardPage;
