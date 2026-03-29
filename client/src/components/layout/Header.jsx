import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={logoStyle}>
          <Link to="/" style={linkStyle}>
            FitTracker
          </Link>
        </h1>
        <nav style={navStyle}>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>

          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" style={navLinkStyle}>
                Dashboard
              </Link>
              <span style={userNameStyle}>Hi, {user?.name || user?.email}</span>
              <button type="button" onClick={logout} style={logoutBtnStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>
                Login
              </Link>
              <Link to="/register" style={navLinkStyle}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: "#000000",
  color: "white",
  padding: "1rem 0",
};
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const logoStyle = { margin: 0, fontSize: "1.5rem" };
const linkStyle = { color: "white", textDecoration: "none" };
const navStyle = { display: "flex", alignItems: "center", gap: "1.25rem" };
const navLinkStyle = { color: "white", textDecoration: "none" };
const userNameStyle = { color: "white", fontSize: "0.9rem" };
const logoutBtnStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  padding: "0.45rem 0.9rem",
};

export default Header;
