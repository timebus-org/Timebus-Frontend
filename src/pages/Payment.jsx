import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";
const API = import.meta.env.VITE_API_URL;
export default function Payment() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BOOKING ================= */
  useEffect(() => {
    const stored = localStorage.getItem("bookingSession");
    if (!stored) {
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      // Create expiry if not present (8 mins default)
      if (!parsed.expiresAt) {
        parsed.expiresAt = Date.now() + 8 * 60 * 1000;
        localStorage.setItem("bookingSession", JSON.stringify(parsed));
      }

      setBooking(parsed);
    } catch (err) {
      localStorage.removeItem("bookingSession");
      navigate("/");
    }
  }, [navigate]);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!booking?.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        Math.floor((booking.expiresAt - Date.now()) / 1000),
        0
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        alert("Session expired. Please book again.");
        localStorage.removeItem("bookingSession");
        navigate("/");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, navigate]);

  /* ================= FORMAT TIMER (MM:SS) ================= */
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
const calculateDuration = (departure, arrival) => {
  if (!departure || !arrival) return "--h --m";

  const normalize = (time) => {
    let t = time.toString().padStart(4, "0");
    let hours = parseInt(t.slice(0, 2), 10);
    let minutes = parseInt(t.slice(2, 4), 10);

    // normalize minutes
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    return hours * 60 + minutes; // total minutes
  };

  let depMinutes = normalize(departure);
  let arrMinutes = normalize(arrival);

  // If arrival is next day
  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60;
  }

  const total = arrMinutes - depMinutes;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  return `${hours}h ${minutes}m`;
};

  /* ================= FORMAT TRAVEL TIME ================= */
  const formatTravelTime = (time) => {
  if (!time) return "--:--";

  let timeStr = time.toString().padStart(4, "0");

  let hours = parseInt(timeStr.slice(0, 2), 10);
  let minutes = parseInt(timeStr.slice(2, 4), 10);

  // 🔥 Normalize minutes if >= 60
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  // Handle next day
  let nextDay = false;
  if (hours >= 24) {
    hours = hours % 24;
    nextDay = true;
  }

  const formattedHours = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm} ${nextDay ? "(+1 Day)" : ""}`;
};


  /* ================= PAYMENT ================= */
 const handlePayment = async () => {
  try {
    setLoading(true);

    const orderRes = await axios.post(
      `${API}/api/create-order`,
      { amount: booking.totalAmount }
    );

    const { orderId, key } = orderRes.data;

    const options = {
      key,
      amount: Math.round(booking.totalAmount * 100),
      currency: "INR",
      name: booking?.bus?.travels || "Bus Booking",
      description: "Bus Ticket Payment",
      order_id: orderId,

      handler: async (response) => {
  try {
    setLoading(true);

    console.log("BLOCK KEY SENT TO CONFIRM:", booking?.blockKey);

    const confirmRes = await axios.post(
      `${API}/api/confirm-ticket`,
      {
        blockKey: booking?.blockKey,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      }
    );

 if (confirmRes.data.success) {
  // Remove the temporary booking session
  localStorage.removeItem("bookingSession");

  // Navigate to TicketSuccess page with ticket data + email
  setTimeout(() => {
    navigate("/ticket-success", {
      state: {
        ...confirmRes.data.data,      // all ticket details
        email: booking.contact.email, // attach email here
      },
    });
  }, 1200);

} else {
  alert("Ticket confirmation failed.");
  setLoading(false);
}


  } catch (err) {
    console.error("Confirm Error:", err);
    alert(
      "Payment successful but ticket confirmation failed. Please contact support."
    );
    setLoading(false);
  }
},


      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },

      prefill: {
        name: booking?.passengers?.[0]?.name || "",
        contact: booking?.contact?.phone || "",
        email: booking?.contact?.email || "",
      },

      theme: { color: "#1E3A8A" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment Init Error:", err);
    alert("Payment initialization failed.");
    setLoading(false);
  }
};


  if (!booking) return null;

  const fromName =
    typeof booking.from === "object"
      ? booking.from?.name
      : booking.from;

  const toName =
    typeof booking.to === "object"
      ? booking.to?.name
      : booking.to;

  return (
    <div className="payment-wrapper">
      <div className="payment-container">

        {/* LEFT */}
        <div className="payment-left">

          <div className="card glass">
            <h2>{booking?.bus?.travels}</h2>
            <p className="bus-type">
              {booking?.bus?.type || "AC Seater"}
            </p>

            <div className="route">
              {fromName} → {toName}
            </div>

            <div className="timings">
              <span>
                Departure: {formatTravelTime(booking?.bus?.departureTime)}
              </span>
              <span>
                Arrival: {formatTravelTime(booking?.bus?.arrivalTime)}
              </span>
              <span>
                Duration: {calculateDuration(
  booking?.bus?.departureTime,
  booking?.bus?.arrivalTime
)}

              </span>
            </div>
          </div>

          <div className="card glass">
            <h3>Seats</h3>
            <div className="seat-list">
              {booking?.seats?.map((s, i) => (
                <div key={i} className="seat-chip">
                  {s.seatName} - ₹{s.fare}
                </div>
              ))}
            </div>
          </div>

          <div className="card glass">
            <h3>Passengers</h3>
            {booking?.passengers?.map((p, i) => (
              <div key={i} className="passenger">
                <strong>{p.name}</strong>
                <span>{p.age} yrs • {p.gender}</span>
              </div>
            ))}
            <div className="contact">
              <p>{booking?.contact?.phone}</p>
              <p>{booking?.contact?.email}</p>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="payment-right card glass">

          <div className="timer-box">
            ⏳ Time Remaining: {formatCountdown(timeLeft)}
          </div>

          <div className="fare-row total">
            Total Amount
            <span>₹{booking.totalAmount}</span>
          </div>

          <button
  className="pay-btn"
  disabled={loading || timeLeft <= 0}
  onClick={handlePayment}
>
  {loading ? (
    <span className="btn-loader">
      <span className="spinner"></span>
      Processing...
    </span>
  ) : (
    "Pay Securely"
  )}
</button>


         {loading ? (
  <p className="secure-text">
    🎟 Confirming your ticket... Please wait.
  </p>
) : (
  <p className="secure-text">
    🔒 100% Secure & Encrypted Payment
  </p>
)}


        </div>
      </div>
    </div>
  );
}

