import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          'http://localhost:5000/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setUploadProgress(progress);
            }
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="App">
      <div className="mainContainer">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload File</button>
        <div>{uploadProgress} %</div>
      </div>
    </div>
  );
}

export default App;
