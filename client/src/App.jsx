import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={appStyle}>
          <Toaster position="top-right" />
          <Header />
          <main style={mainStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "4rem" }}>
    <h1>404 - Page Not Found</h1>
    <p>The workout page you're looking for doesn't exist.</p>
  </div>
);

const appStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};
const mainStyle = { flex: 1 };

export default App;
