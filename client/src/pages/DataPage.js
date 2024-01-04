import React, { useState } from 'react';

function DataPage() {
  // Placeholder for your data-fetching logic

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detections, setDetections] = useState([]);

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
    <div>
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handleUpload}>Upload Picture</button>
        {previewUrl && <img src={previewUrl} alt="Önizleme" className="image-preview" />}
    
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
    </div>
  );
}

export default DataPage;
