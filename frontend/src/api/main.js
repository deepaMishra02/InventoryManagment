import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "X-API-KEY": "6d0f4e8f6d",
    "Content-Type": "application/json",
  },
});