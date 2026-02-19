import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./PaymentFailed.css";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state?.bookingId) {
      navigate("/");
      return;
    }

    releaseSeats();
    // eslint-disable-next-line
  }, []);

  const releaseSeats = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/bookings/release-seats",
        { bookingId: state.bookingId }
      );
    } catch (err) {
      console.error("Seat release failed", err);
    }
  };

  return (
    <div className="failed-container">
      <h1>❌ Payment Failed</h1>
      <p>Your payment was not completed.</p>
      <p>Seats have been released.</p>

      <button onClick={() => navigate("/")}>Try Again</button>
    </div>
  );
}
