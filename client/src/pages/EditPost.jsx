import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Other",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        if (response.data.success) {
          const post = response.data.data;
          setFormData({
            title: post.title,
            content: post.content,
            category: post.category,
          });
        }
      } catch (err) {
        setError("Error fetching post data");
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await api.put(`/posts/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>Edit Post</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Post title"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>New Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              style={{ ...inputStyle, minHeight: "150px" }}
              placeholder="Update your content..."
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={isLoading ? buttonDisabledStyle : buttonStyle}
          >
            {isLoading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: "2rem",
  display: "flex",
  justifyContent: "center",
};
const formCardStyle = {
  maxWidth: "600px",
  width: "100%",
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};
const titleStyle = { marginBottom: "1.5rem", textAlign: "center" };
const formStyle = { display: "flex", flexDirection: "column", gap: "1rem" };
const fieldStyle = { display: "flex", flexDirection: "column", gap: "0.5rem" };
const labelStyle = { fontWeight: "600" };
const inputStyle = {
  padding: "0.75rem",
  borderRadius: "4px",
  border: "1px solid #ddd",
};
const buttonStyle = {
  padding: "0.75rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: "#ccc",
  cursor: "not-allowed",
};
const errorStyle = {
  padding: "0.75rem",
  backgroundColor: "#f8d7da",
  color: "#721c24",
  borderRadius: "4px",
  marginBottom: "1rem",
};

export default EditPost;
