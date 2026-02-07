import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);

      if (user.jwtToken) {
        config.headers.Authorization = `Bearer ${user.jwtToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//API.interceptors.response.use(
//  (response) => response,
//  (error) => {
//    if (error.response?.status === 401) {
//      localStorage.removeItem("token");
//      window.location.href = "/login";
//    }
//
//    return Promise.reject(error);
//  },
//);

export default API;
