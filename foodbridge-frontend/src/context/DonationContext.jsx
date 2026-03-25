import { createContext, useContext, useEffect, useState } from "react";
import * as donationAPI from "../api/donations.api";

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);

  const loadDonations = async () => {
    const res = await donationAPI.getDonations();
    setDonations(res.data);
  };

  const createDonation = async (data) => {
    await donationAPI.createDonation(data);
    await loadDonations();
  };

  const pickupDonation = async (id) => {
    await donationAPI.pickupDonation(id);
    await loadDonations();
  };

  const completeDonation = async (id) => {
    await donationAPI.completeDonation(id);
    await loadDonations();
  };

  useEffect(() => {
    loadDonations();
  }, []);

  return (
    <DonationContext.Provider
      value={{
        donations,
        loadDonations,
        createDonation,
        pickupDonation,
        completeDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => useContext(DonationContext);