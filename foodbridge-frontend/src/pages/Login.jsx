import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    role: "donor"
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    login(form);

    // redirect based on role
    if (form.role === "donor") navigate("/donor");
    if (form.role === "volunteer") navigate("/volunteer");
    if (form.role === "receiver") navigate("/receiver");
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="donor">Donor</option>
          <option value="volunteer">Volunteer</option>
          <option value="receiver">Receiver</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;