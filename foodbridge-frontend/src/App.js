import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Donor from "./pages/Donor";
import Volunteer from "./pages/Volunteer";
import Receiver from "./pages/Receiver";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleIcons = { donor: "🍱", volunteer: "🚚", receiver: "🏠" };
  const roleColors = { donor: "#5aad5a", volunteer: "#e8a030", receiver: "#5a9fd4" };

  return (
    <nav className="navbar">
      <Link to={user ? `/${user.role}` : "/login"} className="nav-brand">
        <span className="nav-logo">🌍</span>
        <span className="nav-title">FoodBridge</span>
      </Link>
      <div className="nav-right">
        {user ? (
          <>
            <div className="nav-badge" style={{ borderColor: roleColors[user.role] }}>
              <span>{roleIcons[user.role]}</span>
              <span className="nav-role" style={{ color: roleColors[user.role] }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <span className="nav-email">{user.email}</span>
            </div>
            <button className="nav-logout" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <Link to="/login" className="nav-login-btn">Sign in</Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/donor" element={<ProtectedRoute><Donor /></ProtectedRoute>} />
        <Route path="/volunteer" element={<ProtectedRoute><Volunteer /></ProtectedRoute>} />
        <Route path="/receiver" element={<ProtectedRoute><Receiver /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;