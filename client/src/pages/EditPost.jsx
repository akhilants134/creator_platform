import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/api/posts/${id}`);
      const post = response.data.data;
      
      // Pre-fill form with existing data
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        status: post.status
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      const message = err.response?.data?.message || 'Failed to load post';
      setError(message);
      toast.error(message);
      setIsLoading(false);
    }
  }, [id]);

  // Fetch post data when component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPost();
  }, [fetchPost]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const response = await api.put(`/api/posts/${id}`, formData);
      
      if (response.data.success) {
        toast.success('Post updated successfully!');
        // Redirect to dashboard after successful update
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={loadingStyle}>Loading post...</div>;
  }

  if (error && !formData.title) {
    return <div style={errorPageStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Edit Post</h1>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Title */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Content */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              required
              style={textareaStyle}
            />
          </div>

          {/* Category */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Category</label>
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
            <label style={labelStyle}>Status</label>
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

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              style={submitButtonStyle}
            >
              {isSaving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles (consistent with CreatePost aesthetics)
const containerStyle = {
  minHeight: '100vh',
  padding: '4rem 2rem',
  background: '#f8f9fa',
};

const formContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  background: 'white',
  padding: '3rem',
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
};

const titleStyle = {
  fontSize: '2.5rem',
  color: '#2d3436',
  marginBottom: '2rem',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyle = {
  fontWeight: '600',
  color: '#2d3436',
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #e1e1e1',
  fontSize: '1rem',
  background: '#fff',
  transition: 'border-color 0.2s',
  outline: 'none',
};

const textareaStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #e1e1e1',
  fontSize: '1rem',
  minHeight: '200px',
  resize: 'vertical',
  outline: 'none',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
};

const submitButtonStyle = {
  flex: 2,
  padding: '1rem',
  background: 'linear-gradient(90deg, #4a90e2 0%, #357abd 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
};

const cancelButtonStyle = {
  flex: 1,
  padding: '1rem',
  background: 'white',
  color: '#636e72',
  border: '1px solid #e1e1e1',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
};

/*
const errorStyle = {
  padding: '1rem',
  background: '#fff2f2',
  color: '#d63031',
  borderRadius: '12px',
  marginBottom: '2rem',
  textAlign: 'center',
};
*/

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  fontSize: '1.2rem',
  color: '#4a90e2',
};

const errorPageStyle = {
  textAlign: 'center',
  padding: '4rem',
  color: '#d63031',
};

export default EditPost;
