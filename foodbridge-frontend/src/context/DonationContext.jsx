import { createContext, useContext, useState } from "react";

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([
    {
      id: 1,
      food_type: "Rice & Curry",
      quantity: 5,
      unit: "plates",
      lat: 11.2588,
      lng: 75.7804,
      distance: 1.2
    }
  ]);

  const addDonation = (donation) => {
    setDonations((prev) => [...prev, donation]);
  };

  const removeDonation = (id) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DonationContext.Provider value={{ donations, addDonation, removeDonation }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => useContext(DonationContext);