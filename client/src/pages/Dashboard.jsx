import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";
import PostCard from "../components/posts/PostCard";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [requestError, setRequestError] = useState("");

  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await api.get("/api/posts");
      // Filter posts created by the current user
      const userPosts = response.data.data.filter(
        (post) => post.author._id === user._id || post.author === user._id,
      );
      setPosts(userPosts);
    } catch (error) {
      setRequestError(
        error.response?.data?.message ||
          "Could not load posts. Please try again.",
      );
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // Listen to newPost events from socket (persists across navigation)
  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleNewPost = (data) => {
      toast.success(data.message);
    };

    socket.on("newPost", handleNewPost);

    return () => {
      socket.off("newPost", handleNewPost);
    };
  }, [socket]);

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/api/posts/${id}`);
        setPosts(posts.filter((post) => post._id !== id));
      } catch (error) {
        alert("Error deleting post");
      }
    }
  };

  if (loading) {
    return <div style={centerStyle}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerSectionStyle}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name || user.email}!</p>
        </div>
        <Link to="/create-post" style={createBtnStyle}>
          + Create New Post
        </Link>
      </div>

      <div style={overviewSectionStyle}>
        <div style={statCardStyle}>
          <h3>Total Posts</h3>
          <p style={statValueStyle}>{posts.length}</p>
        </div>
        <div style={statCardStyle}>
          <h3>Drafts</h3>
          <p style={statValueStyle}>0</p>
        </div>
        <div style={statCardStyle}>
          <h3>Total Reads</h3>
          <p style={statValueStyle}>0</p>
        </div>
      </div>

      <h2 style={sectionTitleStyle}>Your Blog Posts</h2>

      {isLoadingPosts ? (
        <p>Loading your posts...</p>
      ) : posts.length > 0 ? (
        <div style={postsGridStyle}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
              isOwner={true}
            />
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <p>You haven't created any posts yet.</p>
          <Link to="/create-post" style={{ color: "#007bff" }}>
            Create your first post now!
          </Link>
        </div>
      )}

      {requestError && <p style={errorStyle}>{requestError}</p>}

      <div style={{ marginTop: "3rem" }}>
        <button type="button" onClick={logout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>
    </div>
  );
};

const centerStyle = { textAlign: "center", padding: "3rem" };
const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};
const headerSectionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
};
const createBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#28a745",
  color: "white",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold",
};
const overviewSectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginBottom: "3rem",
};
const statCardStyle = {
  padding: "1.5rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #eee",
  textAlign: "center",
};
const statValueStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#007bff",
  marginTop: "0.5rem",
};
const sectionTitleStyle = {
  marginBottom: "1.5rem",
  borderBottom: "2px solid #eee",
  paddingBottom: "0.5rem",
};
const postsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "2rem",
};
const emptyStateStyle = {
  textAlign: "center",
  padding: "3rem",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
};
const subtitleStyle = { marginTop: "0.5rem", color: "#5a5a5a" };
const errorStyle = { marginTop: "1rem", color: "#dc3545" };
const logoutBtnStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#dc3545",
  color: "white",
  cursor: "pointer",
};

export default Dashboard;
