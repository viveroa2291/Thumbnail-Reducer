// ============================================================================
// FILE: App.js (or ImageCompressor.js)
// This is the main component that orchestrates the entire app
// It manages state and handles all the logic for file upload, compression, etc.
// ============================================================================

import React, { useState } from 'react';
import { Upload, Download, Image, AlertCircle } from 'lucide-react';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // ============================================================================
  // UTILITY FUNCTIONS
  // These would go in: utils/imageCompression.js
  // ============================================================================

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Main compression function - would also go in utils/imageCompression.js
  const compressImage = async (file) => {
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          let quality = 0.9;
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const attemptCompression = (q) => {
            canvas.toBlob(
              (blob) => {
                if (blob.size <= maxSizeBytes || q <= 0.1) {
                  resolve(blob);
                } else {
                  attemptCompression(q - 0.1);
                }
              },
              'image/jpeg',
              q
            );
          };
          
          attemptCompression(quality);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // ============================================================================
  // EVENT HANDLERS
  // These stay in App.js to manage state
  // ============================================================================

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

  // ============================================================================
  // RENDER / JSX
  // Below are the component sections that would be split into separate files
  // ============================================================================

  return (
    <>
      {/* ====================================================================
          FILE: styles/ImageCompressor.css
          All the CSS below would go in a separate stylesheet
          ==================================================================== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }

        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .icon-wrapper svg {
          width: 40px;
          height: 40px;
          color: white;
        }

        .title {
          font-size: 32px;
          color: #1a1a1a;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .subtitle {
          color: #666;
          font-size: 16px;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          color: #c00;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .upload-zone {
          border: 3px dashed #ddd;
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-zone:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .upload-zone input {
          display: none;
        }

        .upload-icon {
          width: 60px;
          height: 60px;
          color: #999;
          margin: 0 auto 20px;
        }

        .upload-text {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .upload-subtext {
          font-size: 14px;
          color: #999;
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-card {
          padding: 24px;
          border-radius: 12px;
        }

        .stat-card.original {
          background: #f5f5f5;
        }

        .stat-card.compressed {
          background: #f0f4ff;
        }

        .stat-label {
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .stat-card.original .stat-label {
          color: #333;
        }

        .stat-card.compressed .stat-label {
          color: #667eea;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
        }

        .stat-card.original .stat-value {
          color: #1a1a1a;
        }

        .stat-card.compressed .stat-value {
          color: #667eea;
        }

        .success-message {
          background: #e8f5e9;
          border: 1px solid #a5d6a7;
          border-radius: 8px;
          padding: 16px;
          color: #2e7d32;
          font-weight: 600;
        }

        .button-group {
          display: flex;
          gap: 16px;
        }

        .btn {
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          background: #ddd;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: white;
          border: 2px solid #ddd;
          color: #333;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }
        }
      `}</style>

      {/* ====================================================================
          Main App Container - stays in App.js
          ==================================================================== */}
      <div className="app-container">
        <div className="content-wrapper">
          <div className="header">
            <div className="icon-wrapper">
              <Image />
            </div>
            <h1 className="title">Image Compressor</h1>
            <p className="subtitle">Reduce your images to 2MB or less</p>
          </div>

          {/* ==================================================================
              COMPONENT: ErrorMessage.js
              Props needed: error (string)
              ================================================================== */}
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <p>{error}</p>
            </div>
          )}

          {/* ==================================================================
              COMPONENT: UploadZone.js
              Props needed: onFileUpload (function)
              ================================================================== */}
          {!originalFile ? (
            <div className="upload-zone">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileUpload}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <Upload className="upload-icon" />
                <div className="upload-text">Click to upload an image</div>
                <div className="upload-subtext">Supports JPEG, JPG, and PNG files</div>
              </label>
            </div>
          ) : (
            /* ==================================================================
               COMPONENT: StatsDisplay.js
               Props needed: 
                 - originalSize (number)
                 - compressedSize (number)
                 - isProcessing (boolean)
                 - compressedUrl (string)
                 - formatFileSize (function)
               ================================================================== */
            <div className="results-container">
              <div className="stats-grid">
                <div className="stat-card original">
                  <div className="stat-label">Original</div>
                  <div className="stat-value">{formatFileSize(originalSize)}</div>
                </div>
                <div className="stat-card compressed">
                  <div className="stat-label">Compressed</div>
                  <div className="stat-value">
                    {isProcessing ? 'Processing...' : formatFileSize(compressedSize)}
                  </div>
                </div>
              </div>

              {compressedUrl && (
                <div className="success-message">
                  ✓ Reduced by {Math.round((1 - compressedSize / originalSize) * 100)}%
                </div>
              )}

              {/* ==============================================================
                  COMPONENT: ButtonGroup.js
                  Props needed:
                    - onDownload (function)
                    - onReset (function)
                    - disabled (boolean)
                    - isProcessing (boolean)
                  ============================================================== */}
              <div className="button-group">
                <button
                  onClick={handleDownload}
                  disabled={!compressedUrl || isProcessing}
                  className="btn btn-primary"
                >
                  <Download className="btn-icon" />
                  Download Compressed Image
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  Upload New
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}