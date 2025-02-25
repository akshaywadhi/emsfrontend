import axios from 'axios';
import React, { useEffect, useState } from 'react';


export function FolderViewerAdmin() {
  const [files, setFiles] = useState([]);
  const [directoryHandle, setDirectoryHandle] = useState(null);
  



  const handleFolderOpen = async () => {
    try {
    
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);

      const filesArray = [];
      for await (const entry of handle.values()) {
        if (entry.kind === 'file') {
          filesArray.push(entry);
        }
      }
      setFiles(filesArray);
    } catch (error) {
      console.error('Error accessing folder:', error);
      alert('Failed to access folder');
    }
  };

  const handleFileDownload = async (fileHandle) => {
    try {
      const file = await fileHandle.getFile();
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  return (
    <div className="container mt-4">
      
      <button className="btn btn-primary mb-4" onClick={handleFolderOpen}>
        Open Folder
      </button>
      {files.length > 0 && (
        <div className="row">
          {files.map((fileHandle, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4" key={index}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{fileHandle.name}</h5>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleFileDownload(fileHandle)}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
