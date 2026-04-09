import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setDevToken("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/users/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setMessage(response.data.message);
      setDevToken(response.data.devToken || "");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Unable to request a reset link right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2>Forgot Password</h2>
        <p>Enter your email and we will send a reset link.</p>

        {message ? <p style={successTextStyle}>{message}</p> : null}
        {devToken ? (
          <div style={devBoxStyle}>
            <p style={{ marginTop: 0 }}>Development token:</p>
            <code style={codeStyle}>{devToken}</code>
            <p style={{ marginBottom: 0 }}>
              Open{" "}
              <Link to={`/reset-password/${devToken}`}>the reset form</Link>.
            </p>
          </div>
        ) : null}
        {error ? <p style={errorTextStyle}>{error}</p> : null}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            style={inputStyle}
            autoComplete="email"
          />
          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const wrapperStyle = {
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "2rem",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginTop: "1rem",
};

const inputStyle = {
  padding: "0.8rem",
  borderRadius: "6px",
  border: "1px solid #d0d7de",
};

const buttonStyle = {
  padding: "0.8rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#111827",
  color: "white",
  cursor: "pointer",
};

const errorTextStyle = {
  color: "#b42318",
  marginTop: "0.75rem",
};

const successTextStyle = {
  color: "#067647",
  marginTop: "0.75rem",
};

const devBoxStyle = {
  marginTop: "1rem",
  padding: "1rem",
  borderRadius: "8px",
  backgroundColor: "#f8fafc",
  border: "1px solid #d0d7de",
  textAlign: "left",
};

const codeStyle = {
  display: "block",
  wordBreak: "break-all",
  backgroundColor: "#ffffff",
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

export default ForgotPassword;
