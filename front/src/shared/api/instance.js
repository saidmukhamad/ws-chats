import axios from "axios";

export const link = `http://localhost:3001`;

export const instance = axios.create({
  baseURL: link,
  timeout: 6000,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});
