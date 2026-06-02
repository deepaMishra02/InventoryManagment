import axios from "axios";

export const API = axios.create({
  baseURL: "https://inventory-d4ni.onrender.com",
  headers: {
    "X-API-KEY": "6d0f4e8f6d",
    "Content-Type": "application/json",
  },
});
