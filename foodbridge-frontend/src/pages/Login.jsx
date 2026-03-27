import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "donor",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(formData.username, formData.password);
        navigate(`/${formData.role || 'donor'}`);
      } else {
        // Registration
        if (formData.password !== formData.password2) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }

        const user = await register(
          formData.username,
          formData.email,
          formData.password,
          formData.password2,
          formData.role
        );

        navigate(`/${user.role}`);
      }
    } catch (err) {
      setError(err.detail || err.username?.[0] || err.email?.[0] || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">🌍 FoodBridge</h1>
          <p className="login-subtitle">Connecting surplus food with those in need</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="password2"
                  className="form-input"
                  placeholder="Confirm password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">I want to be a...</label>
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`role-btn ${formData.role === "donor" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "donor" })}
                  >
                    🍱 Donor
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${formData.role === "volunteer" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "volunteer" })}
                  >
                    🚚 Volunteer
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${formData.role === "receiver" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "receiver" })}
                  >
                    🏠 Receiver
                  </button>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="toggle-mode">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => setMode("register")} className="toggle-btn">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="toggle-btn">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
