import React from 'react';
import { Upload } from 'lucide-react';

export default function UploadZone({ onFileUpload }) {
  return (
    <div className="upload-zone">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={onFileUpload}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
        <Upload className="upload-icon" />
        <div className="upload-text">Click to upload an image</div>
        <div className="upload-subtext">Supports JPEG, JPG, and PNG files</div>
      </label>
    </div>
  );
}