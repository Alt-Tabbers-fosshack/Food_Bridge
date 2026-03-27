import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const roles = [
  {
    value: "donor",
    label: "Donor",
    icon: "🍱",
    desc: "Share surplus food with your community",
    color: "#5aad5a"
  },
  {
    value: "volunteer",
    label: "Volunteer",
    icon: "🚚",
    desc: "Pick up & deliver food to those in need",
    color: "#e8a030"
  },
  {
    value: "receiver",
    label: "Receiver",
    icon: "🏠",
    desc: "Receive food donations in your area",
    color: "#5a9fd4"
  }
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("donor");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login({ email, role });
      navigate(`/${role}`);
    }, 600);
  };

  const selectedRole = roles.find(r => r.value === role);

  return (
    <div className="login-page">
      <div className="login-bg-orb orb1" />
      <div className="login-bg-orb orb2" />

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🌍</div>
          <h1 className="login-heading">Welcome to <em>FoodBridge</em></h1>
          <p className="login-sub">Connecting surplus food to people in need</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">Your Email</label>
            <input
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">I am a…</label>
            <div className="role-grid">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-card ${role === r.value ? "selected" : ""}`}
                  style={{ "--role-color": r.color }}
                  onClick={() => setRole(r.value)}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-name">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{ "--role-color": selectedRole.color }}
            disabled={loading || !email}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <span>Enter as {selectedRole.label}</span>
                <span>{selectedRole.icon}</span>
              </>
            )}
          </button>
        </form>

      
      </div>
    </div>
  );
};

export default Login;
