import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FileUploadComponent.css';

const FileUploadComponent = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [loading, setLoading] = useState(false); 
    const fileInputRef = useRef(null);

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        setLoading(true); 
        setSelectedFiles(event.target.files);
        const formData = new FormData();
        for (let i = 0; i < event.target.files.length; i++) {
            formData.append('files', event.target.files[i]);
        }

        try {
            const response = await axios.post('http://44.223.30.95:7000/convert/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Full response:', response); 
            console.log('Response data:', response.data); 

            
            if (response.data && Array.isArray(response.data.download_links)) {
                const links = response.data.download_links.map((link) => ({
                    url: `http://44.223.30.95:7000/${link}`,
                    fileName: link.split('/').pop(), 
                }));
                setDownloadLinks(links);
            } else {
                console.error('Unexpected response format:', response.data);
                setDownloadLinks([]); 
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div>
            <div className="center-content">
                <div className="container">
                    <h1>PDF to Word Converter</h1>
                    <p>Convert PDFs to editable Word documents</p>
                    <button className="file-button" onClick={handleFileButtonClick}>
                        Select File(s)
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        multiple
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    {loading && <p>Converting...</p>} 
                    <p>Or drop PDF files here</p>
                    {downloadLinks.length > 0 && (
                        <div className="download-links">
                            <h2>Click On Below Link to Download Word File</h2>
                            <ul>
                                {downloadLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            <span>{link.fileName}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploadComponent;
