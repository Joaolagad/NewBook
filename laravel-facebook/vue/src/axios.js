import axios from "axios";
import store from "./store";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = store.state.user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.commit('logout');
      sessionStorage.removeItem('TOKEN');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
