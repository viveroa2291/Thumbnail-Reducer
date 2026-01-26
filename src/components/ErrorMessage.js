import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="error-message">
      <AlertCircle className="error-icon" />
      <p>{error}</p>
    </div>
  );
}