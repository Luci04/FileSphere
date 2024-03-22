import React, { useState } from 'react';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import './App.css';

function App() {

  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress('0');
    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (targetFile) => {
    if (targetFile) {
      const formData = new FormData();
      formData.append('file', targetFile);

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
            },
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
        <div className="uploadContainer">
          <div className='inputContainer'>
            <label for="fileInput" class="fileInputLabel">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" /></svg>
            </label>
            <input type="file" id='fileInput' className='file-input' onChange={handleFileChange} />
          </div>
          {/* {downloadLink ? <div>
            <p>Download Link:</p>
            <button onClick={handleDownload}>Download File</button>
          </div> : null} */}
        </div>
        {
          <div style={{
            marginTop: '10px',
            minWidth: '200px',
            maxWidth: '350px',
          }}>
            <ProgressBar width='100%' completed={`${uploadProgress}`} baseBgColor='transparent' />
          </div>
        }
      </div>
    </div>
  );
}

export default App;
