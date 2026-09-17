import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>Share Your Stories with the World</h1>
        <p style={subtitleStyle}>
          Create, publish, and manage your blog posts easily with BlogHub.
        </p>
        <div style={ctaStyle}>
          <Link to="/register" style={buttonStyle}>
            Get Started
          </Link>
          <Link to="/login" style={secondaryButtonStyle}>
            Login
          </Link>
        </div>
      </div>
      <div style={featuresStyle}>
        <h2 style={titleStyle}>Core Features</h2>
        <div style={featureGridStyle}>
          <div style={featureCardStyle}>
            <div style={iconStyle}>✍️</div>
            <h3>Write & Publish</h3>
            <p>Share your thoughts with a global audience.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={iconStyle}>⚙️</div>
            <h3>Manage Posts</h3>
            <p>Edit or delete your content anytime with ease.</p>
          </div>
          <div style={featureCardStyle}>
            <div style={iconStyle}>🌐</div>
            <h3>Connect</h3>
            <p>Join a vibrant community of passionate writers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#fcfcfc",
};

const heroStyle = {
  textAlign: "center",
  padding: "5rem 2rem",
  backgroundColor: "#f4f6f9",
};

const titleStyle = {
  fontSize: "2.5rem",
  marginBottom: "1rem",
  color: "#1e293b",
  fontWeight: "700",
};

const subtitleStyle = {
  fontSize: "1.2rem",
  color: "#64748b",
  marginBottom: "2rem",
  maxWidth: "600px",
  marginLeft: "auto",
  marginRight: "auto",
};

const ctaStyle = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "0.75rem 2rem",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
};

const secondaryButtonStyle = {
  backgroundColor: "white",
  color: "#2563eb",
  padding: "0.75rem 2rem",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
  border: "1.5px solid #2563eb",
};

const featuresStyle = {
  padding: "4rem 2rem",
  textAlign: "center",
};

const featureGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  marginTop: "2.5rem",
  maxWidth: "1100px",
  margin: "2.5rem auto 0 auto",
};

const featureCardStyle = {
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

const iconStyle = {
  fontSize: "2.5rem",
  marginBottom: "1rem",
};

export default Home;