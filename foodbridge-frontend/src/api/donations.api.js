import api from "./axios";

/**
 * Get all donations
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (available, picked_up, delivered)
 * @param {string} params.role - Filter by role (donor, volunteer, receiver)
 * @param {number} params.lat - User latitude for distance calculation
 * @param {number} params.lng - User longitude for distance calculation
 */
export const getDonations = async (params = {}) => {
  try {
    const response = await api.get("/donations/", { params });
    return response.data;
  } catch (error) {
    console.error("Get donations error:", error);
    throw error.response?.data || { detail: "Failed to fetch donations" };
  }
};

/**
 * Get a single donation by ID
 */
export const getDonation = async (id) => {
  try {
    const response = await api.get(`/donations/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to fetch donation" };
  }
};

/**
 * Create a new donation
 */
export const createDonation = async (donationData) => {
  try {
    const response = await api.post("/donations/", donationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to create donation" };
  }
};

/**
 * Update donation status
 * @param {number} id - Donation ID
 * @param {string} action - 'pickup' or 'deliver'
 */
export const updateDonationStatus = async (id, action) => {
  try {
    const response = await api.post(`/donations/${id}/status/`, { action });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to update status" };
  }
};

/**
 * Delete a donation (donor only)
 */
export const deleteDonation = async (id) => {
  try {
    await api.delete(`/donations/${id}/`);
    return { success: true };
  } catch (error) {
    throw error.response?.data || { detail: "Failed to delete donation" };
  }
};
