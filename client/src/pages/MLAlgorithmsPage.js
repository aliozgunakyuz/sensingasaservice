import React, { useState } from 'react';
import './MLAlgorithmsPage.css';

function MLAlgorithmsPage({ selectedPicture }) {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [results, setResults] = useState(null);
    const [detections, setDetections] = useState([]);

    const algorithms = [
        { id: 1, name: 'YOLO' },
        { id: 2, name: 'Algorithm B' },
        { id: 3, name: 'Algorithm C' },
        // ... other algorithms
      ];
    
      const handleAlgorithmChange = (e) => {
        setSelectedAlgorithm(e.target.value);
        // Optionally reset results when algorithm changes
        setResults(null);
      };
      const handleUpload = () => {
        if (selectedPicture) {
          fetch(selectedPicture.src)
            .then(response => response.blob())
            .then(blob => {
              const formData = new FormData();
              formData.append('file', new File([blob], selectedPicture.alt));
    
              return fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
              });
            })
            .then(response => response.json())
            .then(data => {
              console.log("YOLO Results:", data);
              setDetections(data);
            })
            .catch(error => console.error('Error:', error));
        } else {
          console.error('No picture selected');
        }
      };
    
      const handleSeeResults = () => {
        // TODO: Implement logic to compute or fetch results based on selected algorithm
        console.log(`Results for ${selectedAlgorithm}`);
        // For now, we'll just set a dummy result
        setResults(`Results for ${selectedAlgorithm}`);
        if (selectedAlgorithm == 'YOLO'){
            handleUpload();
        }
      };
  return (
    <div className="ml-page-container">
      <h1>Machine Learning Algorithms</h1>
      {selectedPicture ? (
              <div className="ml-algorithm-select-container">
              <label htmlFor="algorithm-select">Choose an algorithm:</label>
              <select id="algorithm-select" value={selectedAlgorithm} onChange={handleAlgorithmChange} className="ml-algorithm-select">
                <option value="">--Please choose an algorithm--</option>
                {algorithms.map((algo) => (
                  <option key={algo.id} value={algo.name}>
                    {algo.name}
                  </option>
                ))}
              </select>
              <button onClick={handleSeeResults} className="ml-algorithm-button">See Results</button>

            </div>
      ) : (
        <p>No sensor selected. Please go to the Sensors page to select.</p>
      )}
      {results ? (
              <div>
                  <h2>YOLO Results:</h2>
                  <ul>
                      {detections.map((det, index) => (
                          <li key={index}>
                              Class: {det.class_name}, Confidence: {det.confidence}, BBox: {det.bbox.join(', ')}
                          </li>
                      ))}
                  </ul>
              </div>
      ):(
        <p></p>
      )}
    </div>
  );
}

export default MLAlgorithmsPage;
