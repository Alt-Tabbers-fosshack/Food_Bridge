import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Donor from "./pages/Donor";
import Volunteer from "./pages/Volunteer";
import Receiver from "./pages/Receiver";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      {/* Navigation */}
      <div>
        <Link to="/login">Login</Link> | 
        <Link to="/donor">Donor</Link> | 
        <Link to="/volunteer">Volunteer</Link> | 
        <Link to="/receiver">Receiver</Link>
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/donor"
          element={
            <ProtectedRoute>
              <Donor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute>
              <Volunteer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receiver"
          element={
            <ProtectedRoute>
              <Receiver />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;