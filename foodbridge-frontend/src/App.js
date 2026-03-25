import { AuthProvider } from "./context/AuthContext";
import { DonationProvider } from "./context/DonationContext";
import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <DonationProvider>
        <AppRoutes />
      </DonationProvider>
    </AuthProvider>
  );
}

export default App;