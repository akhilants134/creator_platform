import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts when component mounts or page changes
  useEffect(() => {
    if (user) {
      fetchPosts(currentPage);
    }
  }, [currentPage, user]);

  const fetchPosts = async (page) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get(`/api/posts?page=${page}&limit=5`);
      
      setPosts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading || (isLoading && posts.length === 0)) {
    return <div style={loadingStyle}>Loading dashboard...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Header with Create Button */}
      <div style={headerStyle}>
        <div>
          <h1 style={welcomeStyle}>Welcome back, {user?.name}!</h1>
          <p style={subtitleStyle}>Manage your creative content</p>
        </div>
        <div style={actionGroupStyle}>
          <Link to="/create">
            <button style={createButtonStyle}>
              + Create New Post
            </button>
          </Link>
          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Posts List */}
      <div style={postsContainerStyle}>
        {posts.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>✍️</div>
            <h3>No posts yet</h3>
            <p>Ready to share your thoughts with the world?</p>
            <Link to="/create" style={emptyLinkStyle}>Create your first post</Link>
          </div>
        ) : (
          <>
            <div style={gridStyle}>
              {posts.map((post) => (
                <div key={post._id} style={postCardStyle}>
                  <div style={cardHeaderStyle}>
                    <span style={badgeStyle(post.category)}>{post.category}</span>
                    <span style={statusBadgeStyle(post.status)}>{post.status}</span>
                  </div>
                  <h3 style={postTitleStyle}>{post.title}</h3>
                  <p style={contentPreviewStyle}>
                    {post.content.substring(0, 150)}...
                  </p>
                  <div style={metaStyle}>
                    <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{...paginationButtonStyle, opacity: !pagination.hasPrevPage ? 0.5 : 1}}
                >
                  Previous
                </button>

                <span style={pageInfoStyle}>
                  Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> 
                  <span style={{marginLeft: '0.5rem', opacity: 0.7}}>({pagination.total} total posts)</span>
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{...paginationButtonStyle, opacity: !pagination.hasNextPage ? 0.5 : 1}}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const postsContainerStyle = {
  marginTop: '2rem',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '3rem',
  padding: '2rem',
  background: 'white',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
};

const welcomeStyle = {
  fontSize: '2rem',
  margin: 0,
  color: '#2d3436',
};

const subtitleStyle = {
  margin: '0.5rem 0 0',
  color: '#636e72',
  fontSize: '1rem',
};

const actionGroupStyle = {
  display: 'flex',
  gap: '1rem',
};

const createButtonStyle = {
  padding: '0.8rem 1.5rem',
  background: 'linear-gradient(90deg, #4a90e2 0%, #357abd 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
};

const logoutButtonStyle = {
  padding: '0.8rem 1.5rem',
  backgroundColor: '#fff',
  color: '#dc3545',
  border: '1px solid #ffcccc',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '600',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '2rem',
};

const postCardStyle = {
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  transition: 'transform 0.3s',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #f1f1f1',
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

const badgeStyle = () => ({
  padding: '0.3rem 0.8rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '600',
  background: '#e1f0ff',
  color: '#007bff',
});

const statusBadgeStyle = (status) => ({
  padding: '0.3rem 0.8rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '600',
  background: status === 'published' ? '#e1f7e1' : '#fff4e1',
  color: status === 'published' ? '#27ae60' : '#f39c12',
});

const postTitleStyle = {
  fontSize: '1.4rem',
  margin: '0 0 1rem',
  color: '#2d3436',
};

const contentPreviewStyle = {
  color: '#636e72',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  flex: 1,
};

const metaStyle = {
  marginTop: '1.5rem',
  fontSize: '0.85rem',
  color: '#b2bec3',
  borderTop: '1px solid #f1f1f1',
  paddingTop: '1rem',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2rem',
  marginTop: '4rem',
  padding: '1.5rem',
};

const paginationButtonStyle = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#4a90e2',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
};

const pageInfoStyle = {
  color: '#2d3436',
  fontSize: '1rem',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '5rem 2rem',
  background: 'white',
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
};

const emptyIconStyle = {
  fontSize: '4rem',
  marginBottom: '1rem',
};

const emptyLinkStyle = {
  color: '#4a90e2',
  fontWeight: '600',
  textDecoration: 'none',
  marginTop: '1rem',
  display: 'inline-block',
};

const errorStyle = {
  padding: '1rem 2rem',
  background: '#fff2f2',
  color: '#d63031',
  borderRadius: '12px',
  marginBottom: '2rem',
  textAlign: 'center',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  fontSize: '1.2rem',
  color: '#4a90e2',
  fontWeight: '600',
};

export default Dashboard;