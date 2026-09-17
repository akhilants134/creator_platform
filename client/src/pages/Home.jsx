import { Link } from 'react-router-dom';
import ConnectionTest from '../components/common/ConnectionTest';

const Home = () => {
  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1>Share Your Stories with the World</h1>
        <p>Create, publish, and manage your blog posts easily with BlogHub.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" style={btnPrimary}>Get Started</Link>
          <Link to="/login" style={btnSecondary}>Login</Link>
        </div>
      </div>
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Core Features</h2>
        <div style={gridStyle}>
          <div style={cardStyle}><h3>Write & Publish</h3><p>Share your thoughts with a global audience.</p></div>
          <div style={cardStyle}><h3>Manage Posts</h3><p>Edit or delete your content anytime.</p></div>
          <div style={cardStyle}><h3>Connect</h3><p>Join a community of passionate writers.</p></div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
};

const heroStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  backgroundColor: '#f5f5f5',
};

const titleStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
  color: '#333',
};

const subtitleStyle = {
  fontSize: '1.25rem',
  color: '#666',
  marginBottom: '2rem',
};

const ctaStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '0.75rem 2rem',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const secondaryButtonStyle = {
  backgroundColor: 'white',
  color: '#007bff',
  padding: '0.75rem 2rem',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  border: '2px solid #007bff',
};

const featuresStyle = {
  padding: '4rem 2rem',
  textAlign: 'center',
};

const featureGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  marginTop: '2rem',
  maxWidth: '1200px',
  margin: '2rem auto',
};

const featureCardStyle = {
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  border: '1px solid #f1f1f1',
  transition: 'transform 0.3s',
};

const iconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

export default Home;