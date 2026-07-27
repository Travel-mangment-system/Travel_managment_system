// src/services/authService.js
import axios from "axios";

// Temporary mock function so the page doesn't crash
export const loginUser = async (loginData) => {
  console.log("Login data submitted:", loginData);
  return { data: { token: "123", role: "CUSTOMER", fullName: "Test User", id: "1" } };
};

export const registerUser = async (userData) => {
  console.log("Register data submitted:", userData);
  return { data: "Success" };
};