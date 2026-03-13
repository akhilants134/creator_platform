import { Link } from 'react-router-dom';
import ConnectionTest from '../components/common/ConnectionTest';

const Home = () => {
  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>Blogging Platform</h1>
        <p style={subtitleStyle}>
          A space for creators to share stories, ideas, and expertise with the world.
        </p>
        <div style={ctaStyle}>
          <Link to="/register" style={buttonStyle}>
            Start Writing
          </Link>
          <Link to="/login" style={secondaryButtonStyle}>
            Login
          </Link>
        </div>
      </div>

      {/* Add the connection test */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <ConnectionTest />
      </div>

      {/* Features Section */}
      <div style={featuresStyle}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#2d3436' }}>Why Choose Blogging Platform?</h2>
        <div style={featureGridStyle}>
          <div style={featureCardStyle}>
            <div style={iconStyle}></div>
            <h3>Powerful Editor</h3>
            <p>Write and format your posts with ease using our intuitive and feature-rich editor designed for creators.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={iconStyle}></div>
            <h3>Grow Your Audience</h3>
            <p>Connect with readers worldwide and build a loyal following around your unique voice and perspective.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={iconStyle}></div>
            <h3>Insightful Analytics</h3>
            <p>Track your growth and understand your audience with detailed insights into post performance and engagement.</p>
          </div>
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