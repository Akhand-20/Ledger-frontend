import axios from "axios";

const api = axios.create({
    baseURL: "https://ledger-backend-3h87.onrender.com/api",
    withCredentials: true, // sends cookies ->your JWT token ->with every request
})

export default api;