import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, loading, user, token } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/users/login", formData);
      const data = response.data;

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Unable to login right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loading && user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={formWrapper}>
      <div style={formCard}>
        <h2>Login</h2>
        <p>Sign in to your account</p>

        {error ? <p style={errorText}>{error}</p> : null}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="current-password"
          />
          <button type="submit" style={submitBtnStyle} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
      </div>
    </div>
  );
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  margin: "1rem 0",
};

const inputStyle = {
  padding: "0.75rem",
  borderRadius: "5px",
  border: "1px solid #d0d0d0",
};

const submitBtnStyle = {
  padding: "0.75rem",
  borderRadius: "5px",
  border: "none",
  color: "white",
  backgroundColor: "#007bff",
  cursor: "pointer",
};

const errorText = {
  color: "#dc3545",
  marginTop: "0.75rem",
  marginBottom: 0,
};

const formWrapper = {
  minHeight: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formCard = {
  maxWidth: "400px",
  width: "100%",
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
};

export default Login;
