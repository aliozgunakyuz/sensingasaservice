import React, { useState } from 'react';
import MainApp from './mainApp'; // Make sure this import path is correct

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <MainApp setSelectedVideo={setSelectedVideo} />
  );
}

export default App;
