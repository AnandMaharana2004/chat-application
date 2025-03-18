// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000/Chat-app/api/v1",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request Interceptor: Attach Token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken"); // i store the access and refresh token in the cookies
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;


import axios from "axios";
import Cookies from "js-cookie"; // Use a library like js-cookie to handle cookies easily

const baseURL = import.meta.env.VITE_BACKEND_BASEURL || "http://localhost:3000/Chat-app/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Ensures cookies are sent with requests
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken"); // Read the access token from cookies
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to a 401 Unauthorized response
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {}, // No need to send the refresh token in the body
          { withCredentials: true } // Ensure cookies are sent with the request
        );

        // Update the access token in cookies (if the backend sets it)
        const newAccessToken = response.data.accessToken;
        Cookies.set("accessToken", newAccessToken, { expires: 1 }); // Set the new access token in cookies

        // Update the Authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        console.error("Failed to refresh token:", refreshError);
        Cookies.remove("accessToken"); // Clear the access token
        Cookies.remove("refreshToken"); // Clear the refresh token
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // If the error is not a 401 or token refresh fails, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;