import api from "./axios";

export const login = async (username, password) => {
  try {
    const response = await api.post("/login/", {
      username,
      password,
    });

    const { user, tokens } = response.data;

    // Store tokens and user
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("foodbridge_user", JSON.stringify(user));

    return { user, tokens };
  } catch (error) {
    throw error.response?.data || { detail: "Login failed" };
  }
};

export const register = async (username, email, password, password2, role) => {
  try {
    const response = await api.post("/register/", {
      username,
      email,
      password,
      password2,
      role,
    });

    const { user, tokens } = response.data;

    // Store tokens and user
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("foodbridge_user", JSON.stringify(user));

    return { user, tokens };
  } catch (error) {
    throw error.response?.data || { detail: "Registration failed" };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/me/");
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to get user" };
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("foodbridge_user");
};
