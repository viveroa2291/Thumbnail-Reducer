import React, { useState } from 'react';
import { compressImage, formatFileSize } from '../utils/imageCompression';
import ErrorMessage from './ErrorMessage';
import UploadZone from './UploadZone';
import StatsDisplay from './StatsDisplay';
import ButtonGroup from './ButtonGroup';
import '../styles/ImageCompressor.css';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, JPG, or PNG image');
      return;
    }

    setError('');
    setIsProcessing(true);
    setOriginalFile(file);
    setOriginalSize(file.size);

    try {
      const compressed = await compressImage(file);
      const url = URL.createObjectURL(compressed);
      
      setCompressedUrl(url);
      setCompressedSize(compressed.size);
    } catch (err) {
      setError('Failed to compress image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed_${originalFile.name.replace(/\.[^/.]+$/, '')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }
    setOriginalFile(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <h1 className="title">Image Compressor</h1>
          <p className="subtitle">Reduce your images to 2MB or less</p>
        </div>

        <ErrorMessage error={error} />

        {!originalFile ? (
          <UploadZone onFileUpload={handleFileUpload} />
        ) : (
          <>
            <StatsDisplay
              originalSize={originalSize}
              compressedSize={compressedSize}
              isProcessing={isProcessing}
              compressedUrl={compressedUrl}
              formatFileSize={formatFileSize}
            />
            <ButtonGroup
              onDownload={handleDownload}
              onReset={handleReset}
              disabled={!compressedUrl || isProcessing}
            />
          </>
        )}
      </div>
    </div>
  );
}