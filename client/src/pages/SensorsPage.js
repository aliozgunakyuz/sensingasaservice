import React, { useState } from 'react';

function SensorsPage({ onPictureSelect }) {
  const [detections, setDetections] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedPictureId, setSelectedPictureId] = useState(null);


  const picSelect = (picture) => {
    setSelectedPicture(picture);
    setPreviewUrl(picture.src); // Set the preview URL to the picture's source
    setSelectedPictureId(picture.id); // Track the selected picture's ID
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

  const pictures = [
    // Replace these with your actual picture data
    { id: 1, src: 'https://miro.medium.com/v2/resize:fit:1400/1*EYFejGUjvjPcc4PZTwoufw.jpeg', alt: 'Image 1' },
    { id: 2, src: 'https://wellsr.com/python/assets/images/2022-02-04-test_image.jpg', alt: 'Image 2' },
    { id: 3, src: 'https://images.unsplash.com/photo-1589828155685-83225f7d91f3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FyJTIwcm9hZHxlbnwwfHwwfHx8MA%3D%3D', alt: 'Image 3' },
    { id: 4, src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3Jvd2QlMjBjaGVlcmluZ3xlbnwwfHwwfHx8MA%3D%3D', alt: 'Image 4' },
    { id: 5, src: 'https://plus.unsplash.com/premium_photo-1681223965635-bdb526bc4989?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 5' },
    { id: 6, src: 'https://plus.unsplash.com/premium_photo-1671658221790-5ef01f87dce3?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 6' },
    { id: 7, src: 'https://cdn.pixabay.com/photo/2023/12/19/21/19/girls-8458409_1280.jpg', alt: 'Image 7' },
    { id: 8, src: 'https://cdn.pixabay.com/photo/2023/08/27/00/08/cycling-8215968_1280.jpg', alt: 'Image 8' },
    { id: 9, src: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_1280.jpg', alt: 'Image 9' },
    { id: 10, src: 'https://cdn.pixabay.com/photo/2016/11/29/08/41/apple-1868496_1280.jpg', alt: 'Image 10' },
    // ... more pictures
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
  };



  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const itemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px', // Adjust as needed to space out grid items
  };
  
  const selectButtonStyle = (pictureId) => ({
    marginTop: '10px',
    padding: '5px 10px',
    cursor: 'pointer',
    backgroundColor: selectedPictureId === pictureId ? '#28a745' : '#007bff', // Green if selected, otherwise blue
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  });
  
  const seeResultsButtonStyle = {
    marginTop: '20px',
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: '#ff5722', // Example fancy color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px', // Larger font size
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Add shadow for a fancier look
  };
  
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px', // Adjust as needed for spacing
  };
  
  return (
    <div>
      <h1>Select a Sensor</h1>
      <div className="picture-list" style={gridStyle}>
        {pictures.map(picture => (
            <div key={picture.id} style={itemStyle}>
            <img 
                src={picture.src} 
                alt={picture.alt} 
                style={imageStyle}
            />
            <button 
                style={selectButtonStyle(picture.id)}
                onClick={() => picSelect(picture)}
            >
                Select Image
            </button>
            </div>
        ))}
        </div>

        <div style={buttonContainerStyle}>
            <button style={seeResultsButtonStyle} onClick={handleUpload}>See Results</button>
        </div>

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

export default SensorsPage;