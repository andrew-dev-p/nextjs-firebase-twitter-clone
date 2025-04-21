import axios, { AxiosHeaders } from "axios";
import { getAuth } from "firebase/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosClient = axios.create({
  baseURL: apiUrl,
});

axiosClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = new AxiosHeaders({
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    });
  }
  return config;
});

export default axiosClient;
