import React, { useCallback, useState } from 'react';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import './App.css';
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';


function App() {

  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);


  const onDrop = useCallback(async acceptedFiles => {
    const zip = new JSZip();

    // Add each file/folder to the zip
    acceptedFiles.forEach((file) => {
      zip.file(file.name, file);
    });

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], `${uuidv4()}.zip`, { type: 'application/zip' });


    // Upload or handle the zip file as needed

    console.log(zipFile)

    handleUpload(zipFile);
  }, [])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, webkitdirectory: true });

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  //   setUploadProgress('0');
  //   handleUpload(e.target.files[0]);
  // };

  const handleUpload = async (targetFile) => {

    console.log(targetFile);

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
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
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
