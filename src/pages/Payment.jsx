import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Payment.css";

/* 🔑 RAZORPAY SCRIPT LOADER (REQUIRED) */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    bookingId,
    tripId,
    busName,
    source,
    destination,
    journeyDate,
    departureTime,
    boardingPoint,
    selectedSeats = [],
    passengers = [],
    totalPrice = 0,
    contact = {},
    seatLockExpiresAt,
  } = state || {};

  useEffect(() => {
    if (!bookingId || !tripId || selectedSeats.length === 0) {
      navigate("/", { replace: true });
    }
  }, [bookingId, tripId, selectedSeats, navigate]);

  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!seatLockExpiresAt) return 0;
    return Math.max(
      Math.floor((new Date(seatLockExpiresAt) - new Date()) / 1000),
      0
    );
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, navigate]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  /* 💳 PAY NOW – FIXED */
  const handlePayNow = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Payment SDK failed. Check internet.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: totalPrice * 100,
      currency: "INR",
      name: busName,
      description: "Bus Ticket Payment",
      handler: (response) => {
        navigate("/success", {
  state: {
    source,
    destination,
    journeyDay,
    journeyDate,
    reportingTime,
    departureTime,
    boardingPoint,
    landmark,
    busName,
    busType,
    passengerName,
    seatNumbers,
    ticketId,
    pnr,
    totalFare,
    supportPhone,
    supportEmail,
  },
});

      },
      prefill: {
        email: contact.email,
        contact: contact.phone,
      },
      theme: { color: "#2563eb" },
    };

    new window.Razorpay(options).open();
  };

  if (!bookingId) return null;

  return (
    <>
      {/* SEAT LOCK */}
      <div className={`seat-lock ${secondsLeft < 120 ? "danger" : ""}`}>
        🔒 Seats locked for <b>{mm}:{ss}</b>
      </div>

      <div className="payment-container">
        {/* LEFT */}
        <div className="payment-left">
          <div className="card">
            <h3>Trip Details</h3>

            <div className="info-row"><span>Bus</span><b>{busName}</b></div>
            <div className="info-row"><span>Route</span><b>{source} → {destination}</b></div>
            <div className="info-row"><span>Date & Time</span><b>{journeyDate} | {departureTime}</b></div>
            <div className="info-row"><span>Boarding</span><b>{boardingPoint}</b></div>
          </div>

          <div className="card">
            <h3>Passenger Details</h3>
            {passengers.map((p, i) => (
              <div key={i} className="passenger-row">
                <div>
                  <div className="passenger-name">{p.name}</div>
                  <div className="passenger-meta">{p.gender}, {p.age} yrs</div>
                </div>
                <div className="seat-badge">Seat {p.seat}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Contact Details</h3>
            <div className="info-row">
              <span>Email</span>
              <b className="bold-black">{contact.email}</b>
            </div>
            <div className="info-row">
              <span>Phone</span>
              <b className="bold-black">{contact.phone}</b>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="payment-right">
          <div className="summary-card">
            <h3>Fare Summary</h3>

            <div className="row"><span>Seats</span><span>{selectedSeats.join(", ")}</span></div>
            <div className="row"><span>Passengers</span><span>{passengers.length}</span></div>

            <div className="row">
              <span>Base Fare</span>
              <span>₹{Math.round(totalPrice / 1.05)}</span>
            </div>

            <div className="row">
              <span>GST (5%)</span>
              <span>₹{totalPrice - Math.round(totalPrice / 1.05)}</span>
            </div>

            <div className="divider" />

            <div className="row total">
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>

            {/* 🔐 SECURITY */}
            <div className="secure-box">
              🔐 Razorpay Secure Payments  
              <br />✔ PCI-DSS Compliant  
              <br />✔ No card details stored
            </div>

            <button className="pay-btn" onClick={handlePayNow}>
              Pay ₹{totalPrice}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-pay-bar">
        <div>
          <span>Total</span>
          <b>₹{totalPrice}</b>
        </div>
        <button onClick={handlePayNow}>Pay Now</button>
      </div>
    </>
  );
}
