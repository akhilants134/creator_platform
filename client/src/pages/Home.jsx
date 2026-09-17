import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
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

const heroStyle = { textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#f8f9fa' };
const btnPrimary = { backgroundColor: '#007bff', color: 'white', padding: '0.75rem 2rem', borderRadius: '5px', textDecoration: 'none' };
const btnSecondary = { border: '2px solid #007bff', color: '#007bff', padding: '0.75rem 2rem', borderRadius: '5px', textDecoration: 'none' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '2rem auto' };
const cardStyle = { padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };

export default Home;