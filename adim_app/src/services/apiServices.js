import axios from "axios";
import Cookies from "js-cookie";
const apiClient = axios.create({
  baseURL: "http://localhost:1010/api/auth/",
  timeout: 10000,
});

const unauthApiService = axios.create({
  baseURL: "http://localhost:1010/api/unauth/",
  timeout: 10000,
});

// Add a request interceptor to include headers
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Retrieve token from storage

    if (token) {
      config.headers.Authorization = `${token}`; // Attach token to headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export helper methods for API calls
export const apiService = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export { unauthApiService };
export default apiClient;
