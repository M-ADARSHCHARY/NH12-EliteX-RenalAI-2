import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Change to your Flask backend URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'multipart/form-data', // For file uploads
  },
});

export default axiosInstance;
