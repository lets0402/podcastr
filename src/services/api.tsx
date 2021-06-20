import axios from "axios";
const PORT = process.env.PORT || 3000;

const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  proxy: {
    host: process.env.HOST || "localhost",
    port: Number(PORT),
    protocol: "http",
  },
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
