import React from 'react';
import { Download } from 'lucide-react';

export default function ButtonGroup({ onDownload, onReset, disabled }) {
  return (
    <div className="button-group">
      <button
        onClick={onDownload}
        disabled={disabled}
        className="btn btn-primary"
      >
        <Download className="btn-icon" />
        Download Compressed Image
      </button>
      <button
        onClick={onReset}
        className="btn btn-secondary"
      >
        Upload New
      </button>
    </div>
  );
}