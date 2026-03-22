import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Donor from "./pages/Donor";
import Volunteer from "./pages/Volunteer";
import Receiver from "./pages/Receiver";

function App() {
  return (
    <BrowserRouter>
      {/* 🔹 Temporary Navigation */}
      <div>
        <a href="/login">Login</a> | 
        <a href="/donor">Donor</a> | 
        <a href="/volunteer">Volunteer</a> | 
        <a href="/receiver">Receiver</a>
      </div>

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<h1>Landing Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/receiver" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;