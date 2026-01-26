import React from 'react';

export default function StatsDisplay({ 
  originalSize, 
  compressedSize, 
  isProcessing, 
  compressedUrl,
  formatFileSize 
}) {
  return (
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
    </div>
  );
}