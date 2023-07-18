import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    axios
      .post('http://localhost:8000/upload', formData)
      .then((response) => {
        console.log(response.data);
        setFileName('');
        fetchFiles();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchFiles = () => {
    axios
      .get('http://localhost:8000/files')
      .then((response) => {
        if (response.data && response.data.data) {
          setFilesList(
            response.data.data.map((fileName) => ({
              id: uuidv4(),
              name: fileName,
            }))
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDownload = (fileName) => {
    window.open(`http://localhost:8000/download/${fileName}`, '_blank');
  };

  return (
    <div className="app">
      <h1>File Upload Application</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file" className="label">
          Choose File
        </label>
        <span className="file-name">{fileName}</span>
        <input type="file" id="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <h2>File List:</h2>
      <ul>
        {filesList.map((file) => (
          <li key={file.id}>
            {file.name}
            <button onClick={() => handleDownload(file.name)}>Download</button>
          </li>
        ))}
        
      </ul>
    </div>
  );
}

export default App;


