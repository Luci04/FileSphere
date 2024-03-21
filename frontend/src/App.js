import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
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

        setDownloadLink(response.data.downloadLink);
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank'); // Open download link in a new tab
    }
  };

  return (
    <div className="App">
      <div className="mainContainer">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload File</button>
        <div>{uploadProgress} %</div>
        {downloadLink && <div>
          <p>Download Link:</p>
          <button onClick={handleDownload}>Download File</button>
        </div>}
      </div>
    </div>
  );
}

export default App;
