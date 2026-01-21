import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PassengerInfo.css";

export default function PassengerInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const {
  busId,
  tripId,
  busName,
  busType,
  source,
  destination,
  journeyDate,
  boardingPoint,
  droppingPoint,
  selectedSeats,
  totalPrice,
  departureTime,
  arrivalTime,
  duration,
} = state;

  const normalizedSeats = Array.isArray(selectedSeats)
  ? selectedSeats.map((s) => (typeof s === "string" ? s : s.seatNumber))
  : [];

  /* PASSENGERS */
  const [passengers, setPassengers] = useState(
  normalizedSeats.map((seat) => ({
    seat,
    name: "",
    age: "",
    gender: "",
    errors: {},
  }))
);


  const handlePassengerChange = (index, field, value) => {
    const copy = [...passengers];
    copy[index][field] = value;

    const errors = {};
    if (!copy[index].name) errors.name = "Required";
    if (!copy[index].age || copy[index].age < 1) errors.age = "Invalid";
    if (!copy[index].gender) errors.gender = "Required";

    copy[index].errors = errors;
    setPassengers(copy);
  };

  const isPassengerValid = (p) =>
    p.name && p.age && p.gender && Object.keys(p.errors).length === 0;

  const isAllPassengersValid = passengers.every(isPassengerValid);

  /* CONTACT */
  const [contact, setContact] = useState({ phone: "", email: "" });
  const isContactValid =
    /^\d{10}$/.test(contact.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

  /* TRIP ASSURANCE */
  const ASSURANCE_PRICE = 119;
  const [tripAssured, setTripAssured] = useState(true);

  /* COUPON */
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const applyCoupon = () => {
    if (coupon === "TIMEBUS50") {
      setDiscount(50);
      setCouponMsg("Coupon applied successfully");
    } else {
      setDiscount(0);
      setCouponMsg("Invalid coupon");
    }
  };

  const finalAmount = totalPrice + (tripAssured ? ASSURANCE_PRICE : 0) - discount;

  const handleContinue = async () => {
  if (!isAllPassengersValid || !isContactValid) return;

  const bookingId = `TB${Date.now()}`;
  const seatLockExpiresAt = Date.now() + 10 * 60 * 1000;

  navigate("/payment", {
    state: {
      bookingId,
      tripId,
      busName,
      source,
      destination,
      journeyDate,
      departureTime,
      boardingPoint,
      selectedSeats: normalizedSeats,
      passengers,
      totalPrice: finalAmount,
      contact,
      seatLockExpiresAt,
      
    },
  });
};



  return (
    <div className="tb-page">
      <div className="tb-layout">

        {/* LEFT COLUMN */}
        <div className="tb-left">

          {/* BUS HEADER */}
          <div className="tb-card tb-bus-header">
            <div className="tb-bus-top">
              <div>
                <h1 className="tb-bus-name">{busName}</h1>
                <span className="tb-bus-type">{busType}</span>
              </div>
              <span className="tb-date">{journeyDate}</span>
            </div>

            <div className="tb-time-row">
              <div>
                <div className="tb-time">{departureTime}</div>
                <div className="tb-city">{source}</div>
              </div>

              <div className="tb-duration">
                <span>{duration}</span>
                <div className="tb-line" />
              </div>

              <div>
                <div className="tb-time">{arrivalTime}</div>
                <div className="tb-city">{destination}</div>
              </div>
            </div>

            <div className="tb-point-row">
              <span>📍 Boarding: <b>{boardingPoint}</b></span>
              <span>📍 Dropping: <b>{droppingPoint}</b></span>
            </div>

            <div className="tb-seat-layout">
              {normalizedSeats.map((s) => (
  <span key={s} className="tb-seat">Seat {s}</span>
))}

              
            </div>
          </div>

          {/* PASSENGERS */}
          <div className="tb-section-title">
            Passenger Details
            <span>Details as per government ID</span>
          </div>

          {passengers.map((p, i) => (
            <div key={p.seat} className="tb-card tb-passenger-card">
              <div className="tb-passenger-header">
                <span className="tb-seat-chip">Seat {p.seat}</span>
                <span className={`tb-status ${isPassengerValid(p) ? "valid" : ""}`}>
                  {isPassengerValid(p) ? "✔" : "○"}
                </span>
              </div>

              <div className="tb-form-grid">
                <input
                  placeholder="Full Name"
                  className={p.errors.name ? "error" : ""}
                  value={p.name}
                  onChange={(e) =>
                    handlePassengerChange(i, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Age"
                  className={p.errors.age ? "error" : ""}
                  value={p.age}
                  onChange={(e) =>
                    handlePassengerChange(i, "age", e.target.value)
                  }
                />
                <select
                  className={p.errors.gender ? "error" : ""}
                  value={p.gender}
                  onChange={(e) =>
                    handlePassengerChange(i, "gender", e.target.value)
                  }
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          ))}

          {/* CONTACT */}
          <div className="tb-card">
            <h3>Contact Details</h3>
            <p className="tb-muted">Ticket & updates will be sent here</p>

            <div className="tb-form-grid">
              <input
                placeholder="Mobile Number"
                maxLength="10"
                className={!isContactValid && contact.phone ? "error" : ""}
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
              />
              <input
                placeholder="Email ID"
                className={!isContactValid && contact.email ? "error" : ""}
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* TRIP ASSURANCE */}
          <div className="tb-card tb-assurance">
            <div className="tb-assurance-header">
              <div>
                <h3>Trip Assurance</h3>
                <p>Instant refunds • 24×7 support</p>
              </div>
              <input
                type="checkbox"
                checked={tripAssured}
                onChange={() => setTripAssured(!tripAssured)}
              />
            </div>

            {tripAssured && (
              <div className="tb-assured-box">
                ✔ 150% refund on cancellation<br />
                ✔ 100% refund on delays
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="tb-right">
          <div className="tb-card tb-sticky">
            <h3>Fare Summary</h3>

            <div className="tb-fare-row">
              <span>Seat Fare</span>
              <span>₹{totalPrice}</span>
            </div>

            {tripAssured && (
              <div className="tb-fare-row">
                <span>Trip Assurance</span>
                <span>₹{ASSURANCE_PRICE}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="tb-fare-row success">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="tb-divider" />

            <div className="tb-fare-total">
              <strong>Total</strong>
              <strong>₹{finalAmount}</strong>
            </div>

            <div className="tb-coupon-row">
              <input
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            {couponMsg && <p className="tb-coupon-msg">{couponMsg}</p>}

            <p className="tb-trust">🔒 Secure PCI-DSS payments</p>

            <button
              className="tb-primary-btn"
              disabled={!isAllPassengersValid || !isContactValid}
              onClick={handleContinue}
            >
              Pay ₹{finalAmount} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
