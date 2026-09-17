import { Link } from 'react-router-dom';

const PostCard = ({ post, onDelete, isOwner }) => {
  return (
    <div style={cardStyle}>
      <img
        src={post.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={post.title}
        style={imageStyle}
      />
      <div style={contentWrapperStyle}>
        <span style={categoryStyle}>{post.category}</span>
        <h3 style={titleStyle}>{post.title}</h3>
        <p style={excerptStyle}>
          {post.content.substring(0, 100)}...
        </p>
        <div style={infoStyle}>
          <span>By {post.author.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {isOwner && (
          <div style={actionsStyle}>
            <Link to={`/edit-post/${post._id}`} style={editBtnStyle}>
              Edit
            </Link>
            <button onClick={() => onDelete(post._id)} style={deleteBtnStyle}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const contentWrapperStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const categoryStyle = {
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: '#007bff',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
};

const titleStyle = {
  marginBottom: '1rem',
  fontSize: '1.25rem',
};

const excerptStyle = {
  color: '#666',
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
  flex: 1,
};

const infoStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8rem',
  color: '#999',
  marginBottom: '1rem',
};

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: 'auto',
};

const editBtnStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ffc107',
  color: 'black',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
};

const deleteBtnStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default PostCard;
