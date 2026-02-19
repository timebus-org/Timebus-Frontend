import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Try to read from location state first
    let stateBooking = history.state?.usr; // React Router v6 internal state
    if (!stateBooking) {
      // fallback to localStorage
      const saved = localStorage.getItem("lastBooking");
      if (saved) stateBooking = JSON.parse(saved);
    }

    if (!stateBooking) {
      navigate("/"); // redirect if no booking info
    } else {
      setBooking(stateBooking);
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "2rem", border: "1px solid #ccc", borderRadius: "10px" }}>
        <div style={{ fontSize: "3rem" }}>🚖</div>
        <h2>Booking Request Sent!</h2>
        <p>Your booking request has been successfully sent to the cab owner.</p>

        <div style={{ textAlign: "left", margin: "1rem 0" }}>
          <p><b>Cab:</b> {booking.cab}</p>
          <p><b>From:</b> {booking.from}</p>
          <p><b>To:</b> {booking.to}</p>
          <p><b>Date:</b> {booking.date}</p>
          <p><b>Time:</b> {booking.time}</p>
        </div>

        <p>📞 The cab owner will contact you shortly to confirm the booking.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    </div>
  );
}
