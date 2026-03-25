import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';


const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploadError, setUploadError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async (imageFormData) => {
    setUploading(true);
    setUploadError('');

    try {
      const response = await api.post('/api/upload', imageFormData);
      // response.data should be: { success: true, url: "...", publicId: "..." }

      if (response.data.success) {
        setCoverImageUrl(response.data.url);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Image upload failed';
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * TODO: Handle the orphaned upload problem.
   * Currently, if a user uploads an image but then changes it or cancels the post,
   * the old image remains on Cloudinary. Future improvement: delete the old image
   * using its public_id before setting a new coverImageUrl or on component unmount
   * if the post wasn't created.
   */


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData = {
        ...formData,
        coverImage: coverImageUrl // This is null if no image was uploaded
      };

      const response = await api.post('/api/posts', postData);
      
      if (response.data.success) {
        toast.success('Post created successfully!');
        // Redirect to dashboard after successful creation
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1>Create New Post</h1>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Title */}
          <div style={fieldStyle}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              style={inputStyle}
            />
          </div>

          {/* Content */}
          <div style={fieldStyle}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="10"
              required
              style={textareaStyle}
            />
          </div>

          {/* Category */}
          <div style={fieldStyle}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* Status */}
          <div style={fieldStyle}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Image Upload Component */}
          <div style={fieldStyle}>
            <label>Upload Image</label>
            <ImageUpload onUpload={handleUpload} />
          </div>


          {/* Upload Status & Error */}
          {uploading && <p style={{ color: '#4a90e2' }}>Uploading image, please wait...</p>}
          {uploadError && <p style={{ color: '#d63031' }}>{uploadError}</p>}

          <button 
            type="submit" 
            disabled={isLoading || uploading}
            style={buttonStyle}
          >
            {isLoading ? 'Creating...' : (uploading ? 'Uploading Image...' : 'Create Post')}
          </button>
        </form>
      </div>
    </div>
  );
};

// Add styles...
const containerStyle = {
  minHeight: '100vh',
  padding: '4rem 2rem',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const formContainerStyle = {
  width: '100%',
  maxWidth: '800px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  padding: '3rem',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginTop: '2rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const inputStyle = {
  padding: '0.8rem 1.2rem',
  borderRadius: '12px',
  border: '1px solid #e1e8ed',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  '&:focus': {
    borderColor: '#4a90e2',
    boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.1)',
  },
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '200px',
  fontFamily: 'inherit',
};

const buttonStyle = {
  marginTop: '1rem',
  padding: '1rem 2rem',
  background: 'linear-gradient(90deg, #4a90e2 0%, #357abd 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
};

/*
const errorStyle = {
  padding: '1rem',
  background: '#fff2f2',
  color: '#d63031',
  borderRadius: '12px',
  borderLeft: '4px solid #d63031',
  marginBottom: '1rem',
};
*/

export default CreatePost;