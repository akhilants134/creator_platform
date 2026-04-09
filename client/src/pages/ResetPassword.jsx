import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`/api/users/reset/${token}`);
        setIsTokenValid(true);
        setEmail(response.data.email || "");
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Invalid or expired reset token.",
        );
      } finally {
        setIsValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post(`/api/users/reset/${token}`, {
        newPassword,
      });

      setStatusMessage(response.data.message);
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Unable to reset password right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return <div style={wrapperStyle}>Validating reset link...</div>;
  }

  if (!isTokenValid) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2>Reset Link Unavailable</h2>
          <p style={errorTextStyle}>{error}</p>
          <p>
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2>Reset Password</h2>
        {email ? (
          <p>Resetting password for {email}</p>
        ) : (
          <p>Create a new password.</p>
        )}

        {statusMessage ? <p style={successTextStyle}>{statusMessage}</p> : null}
        {error ? <p style={errorTextStyle}>{error}</p> : null}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            style={inputStyle}
            autoComplete="new-password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            style={inputStyle}
            autoComplete="new-password"
          />
          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Reset Password"}
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

export default ResetPassword;
