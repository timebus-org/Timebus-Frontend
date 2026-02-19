import axios from "axios";

const API = "http://localhost:5000/api/trips";

export const getTripDetails = (tripId) =>
  axios.get(`${API}/trip-details/${tripId}`);
