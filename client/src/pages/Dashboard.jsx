import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div style={centerStyle}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={containerStyle}>
      <h1>Dashboard</h1>
      <p>Welcome back, {user.name || user.email}!</p>
      <p style={subtitleStyle}>Email: {user.email}</p>

      <div style={cardStyle}>
        <h2>Your Fitness Stats</h2>
        <ul>
          <li>Recent Workouts: Leg Day, Upper Body</li>
          <li>Current Streak: 5 Days</li>
          <li>Next Goal: 100kg Squat</li>
        </ul>
      </div>

      <button type="button" onClick={logout} style={logoutBtnStyle}>
        Logout
      </button>
    </div>
  );
};

const centerStyle = {
  textAlign: "center",
  padding: "3rem",
};

const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const subtitleStyle = {
  marginTop: "0.5rem",
  color: "#5a5a5a",
};

const cardStyle = {
  backgroundColor: "#f8f9fa",
  padding: "2rem",
  borderRadius: "8px",
  marginTop: "2rem",
};

const logoutBtnStyle = {
  marginTop: "1.5rem",
  padding: "0.75rem 1.5rem",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#dc3545",
  color: "white",
  cursor: "pointer",
};

export default Dashboard;
