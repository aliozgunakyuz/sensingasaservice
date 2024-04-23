import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './mainApp'; // Make sure this import path is correct

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <Router>
      <MainApp setSelectedVideo={setSelectedVideo} />
    </Router>
  );
}

export default App;
