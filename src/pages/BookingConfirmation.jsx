import { useLocation } from "react-router-dom";
import "./BookingConfirmation.css";

export default function BookingConfirmation() {
  const { state } = useLocation();

  if (!state) return <div>No booking found</div>;

  const {
    cab,
    from,
    to,
    date,
    distanceKm,
    totalFare,
    paidAmount,
    paymentType,
  } = state;

  return (
    <div className="invoice-bg">
      <div className="invoice-card">
        <h2>Booking Confirmed ✅</h2>

        <div className="invoice-section">
          <p><b>Car:</b> {cab.name} / AC</p>
          <p><b>From:</b> {from}</p>
          <p><b>To:</b> {to}</p>
          <p><b>Date:</b> {date}</p>
          <p><b>Distance:</b> {distanceKm} Km</p>
        </div>

        <div className="invoice-section">
          <p><b>Total Fare:</b> ₹{totalFare}</p>
          <p><b>Paid:</b> ₹{paidAmount}</p>
          <p><b>Payment Type:</b> {paymentType}</p>
        </div>

        <div className="invoice-footer">
          <p>Thank you for booking with <b>Timebus Cabs</b></p>
        </div>
      </div>
    </div>
  );
}
