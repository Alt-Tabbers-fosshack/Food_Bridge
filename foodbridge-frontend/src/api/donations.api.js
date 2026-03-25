import api from "./axios";

export const getDonations = () => api.get("/donations");

export const createDonation = (data) =>
  api.post("/donations", data);

export const pickupDonation = (id) =>
  api.put(`/donations/${id}/pickup`);

export const completeDonation = (id) =>
  api.put(`/donations/${id}/complete`);