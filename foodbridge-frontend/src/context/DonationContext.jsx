import { createContext, useState, useContext, useEffect } from "react";
import { 
  getDonations, 
  createDonation as apiCreateDonation,
  updateDonationStatus as apiUpdateStatus 
} from "../api/donations.api";
import { useAuth } from "./AuthContext";

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch donations when user changes
  useEffect(() => {
    if (user) {
      fetchDonations();
    } else {
      setDonations([]);
    }
  }, [user]);

  const fetchDonations = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Add user's geolocation if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const donations = await getDonations({
              ...params,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setDonations(donations);
            setLoading(false);
          },
          async () => {
            // Geolocation failed, fetch without location
            const donations = await getDonations(params);
            setDonations(donations);
            setLoading(false);
          }
        );
      } else {
        const donations = await getDonations(params);
        setDonations(donations);
        setLoading(false);
      }
    } catch (err) {
      setError(err.detail || "Failed to fetch donations");
      setLoading(false);
    }
  };

  const addDonation = async (donationData) => {
    setLoading(true);
    setError(null);
    try {
      const newDonation = await apiCreateDonation(donationData);
      setDonations((prev) => [newDonation, ...prev]);
      return newDonation;
    } catch (err) {
      setError(err.detail || "Failed to create donation");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDonation = await apiUpdateStatus(id, action);
      
      // Update local state
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? updatedDonation : d))
      );
      
      return updatedDonation;
    } catch (err) {
      setError(err.detail || "Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DonationContext.Provider 
      value={{ 
        donations, 
        addDonation, 
        updateStatus, 
        fetchDonations,
        loading, 
        error 
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => useContext(DonationContext);