import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // Part 3: Implement Client-Side Validation
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (JPEG, PNG, WebP, or GIF)';
    }

    if (file.size > maxSizeInBytes) {
      return `File is too large. Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null; // null means no error
  };

  // Part 2: Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // If user cancels the picker without selecting, files[0] will be undefined
    if (!file) return;

    // Clear previous errors
    setError('');

    // Validate the file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Set the file and generate a preview
    setSelectedFile(file);

    // Revoke previous preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Part 5: Clean Up Object URLs
  useEffect(() => {
    // This runs when previewUrl changes or the component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Part 6: Build the FormData on Submission
  const handleInternalSubmit = () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' matches upload.single('image') on the backend

    // Pass formData up to the parent component via the onUpload prop
    if (onUpload) {
      onUpload(formData);
    }
  };

  return (
    <div className="image-upload-container" style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div className="image-upload-content">
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image-input" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Select Image:
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
          />
        </div>

        {/* Part 3: Display Validation Errors */}
        {error && (
          <p style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </p>
        )}

        {/* Part 4: Show the Image Preview */}
        {previewUrl && (
          <div style={{ margin: '20px 0' }}>
            <p style={{ fontWeight: 'bold' }}>Preview:</p>
            <img
              src={previewUrl}
              alt="Selected file preview"
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        )}

        {/* Part 6: Add the Submit Button */}
        <button
          type="button"
          onClick={handleInternalSubmit}
          disabled={!selectedFile || !!error}
          style={{
            padding: '10px 20px',
            backgroundColor: (!selectedFile || !!error) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!selectedFile || !!error) ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
