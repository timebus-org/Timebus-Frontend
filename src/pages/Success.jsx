import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // 1️⃣ Try React Router state
    if (location.state) {
      setBooking(location.state);
      localStorage.setItem("lastBooking", JSON.stringify(location.state));
      return;
    }

    // 2️⃣ Fallback to localStorage
    const saved = localStorage.getItem("lastBooking");
    if (saved) {
      setBooking(JSON.parse(saved));
      return;
    }

    // 3️⃣ Nothing found → go home
    navigate("/");
  }, [location.state, navigate]);

  if (!booking) return null;

  return (
    <div className="success-bg">
      <div className="success-card">
        <div className="success-icon">🚖</div>

        <h2>Booking Request Sent!</h2>

        <p className="success-msg">
          Your booking request has been successfully sent to the cab owner.
        </p>

        <div className="trip-box">
          <p><b>Cab:</b> {booking.cab}</p>
          <p><b>From:</b> {booking.from}</p>
          <p><b>To:</b> {booking.to}</p>
          <p><b>Date:</b> {booking.date}</p>
          <p><b>Time:</b> {booking.time}</p>
        </div>

        <p className="note">
          📞 The cab owner will contact you shortly to confirm the booking.
        </p>

        <button onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
