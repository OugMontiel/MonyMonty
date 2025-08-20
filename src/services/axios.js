// src/services/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Ajustar si se cambia el puerto o path
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
