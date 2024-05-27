import React from 'react';
import myGif from '../imgs/techny-data-dashboard-with-charts-and-graphs.gif'; // Ensure the correct path to your GIF file
import './Dashboard.css';

function DashboardPage() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-content">
          <div className="left-content">
            <h1>Welcome to Your Dashboard</h1>
            <p>
            The "Sensing as a Service" app makes it easy for developers to use sensor data with smart technology. It provides a user-friendly platform where they can choose different data sources and apply smart algorithms without worrying about the complicated backend processes. The app helps in real-time data handling, making it perfect for applications like smart cities. With this app, developers can focus more on building new, innovative projects and less on technical details, speeding up the creation of smarter, data-driven services.
            </p>
          </div>
          <div className="right-content">
            <img src={myGif} alt="Dashboard GIF" className="dashboard-gif" />
            <div className="gif-credit">

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default DashboardPage;
