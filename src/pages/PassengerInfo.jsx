import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./PassengerInfo.css";

export default function PassengerInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { tripData } = state || {};

  if (!state) return null;

  const {
    bus,
    from,
    to,
    date,
    selectedSeats,
    boardingPoint,
    droppingPoint,
    seatFare,
    gst,
  } = state;

  const normalizedSeats = selectedSeats || [];
  const safeBoarding = boardingPoint || { location: "", time: "", bpId: 0 };
  const safeDropping = droppingPoint || { location: "", time: "", bpId: 0 };

  /* ===== PASSENGERS ===== */
  const [passengers, setPassengers] = useState(
    normalizedSeats.map((seatObj) => ({
      seatName: seatObj.seatName,
      title: "",
      name: "",
      age: "",
      gender: "",
      idType: "",
      idNumber: "",
      bookingType: "",
      primary: false,
      address: "",
      errors: {},
    }))
  );

  const handlePassengerChange = (index, field, value) => {
    const copy = [...passengers];

    if (typeof value === "string") value = value.trim();

    if (field === "age") value = value.replace(/\D/g, "");

    /* 🔥 HARD ID CONTROL */
    if (field === "idType") {
      copy[index].idNumber = "";
    }

    if (field === "idNumber") {
      value = value.replace(/\s/g, "").toUpperCase();
      const idType = copy[index].idType;

      if (idType === "Aadhaar")
        value = value.replace(/\D/g, "").slice(0, 12);

      else if (idType === "Voter ID")
        value = value.replace(/[^A-Z0-9]/g, "").slice(0, 12);

      else if (idType === "Passport")
        value = value.replace(/[^A-Z0-9]/g, "").slice(0, 9);

      else if (idType === "Driving License")
        value = value.replace(/[^A-Z0-9-]/g, "").slice(0, 20);
    }

    if (field === "primary" && value === true) {
      copy.forEach((p, i) => (p.primary = i === index));
    } else {
      copy[index][field] = value;
    }

    const p = copy[index];
    const errors = {};

    if (!p.title) errors.title = "Required";

    if (!p.name || !/^[A-Za-z ]{2,}$/.test(p.name))
      errors.name = "Invalid name";

    const ageNum = Number(p.age);
    if (!ageNum || ageNum < 1 || ageNum > 120)
      errors.age = "Invalid age";

    if (!p.gender) errors.gender = "Required";
    if (!p.idType) errors.idType = "Required";

    if (!p.idNumber) {
      errors.idNumber = "Required";
    } else {
      if (p.idType === "Aadhaar" && !/^\d{12}$/.test(p.idNumber))
        errors.idNumber = "Aadhaar must be exactly 12 digits";

      else if (p.idType === "Voter ID" && !/^[A-Z]{3}[0-9]{7}$/.test(p.idNumber))
        errors.idNumber = "Invalid Voter ID";

      else if (p.idType === "Passport" && !/^[A-Z][0-9]{7}$/.test(p.idNumber))
        errors.idNumber = "Invalid Passport";

      else if (
        p.idType === "Driving License" &&
        !/^[A-Z]{2}[0-9]{2}[0-9]{4,}$/.test(p.idNumber)
      )
        errors.idNumber = "Invalid Driving License";
    }

    if (!p.bookingType) errors.bookingType = "Required";
    if (!p.address || p.address.length < 5)
      errors.address = "Invalid address";

    p.errors = errors;
    setPassengers(copy);
  };

  const isPassengerValid = (p) =>
    p.title &&
    p.name &&
    p.age > 0 &&
    p.gender &&
    p.idType &&
    p.idNumber &&
    p.bookingType &&
    p.address &&
    Object.keys(p.errors).length === 0;

  const isAllPassengersValid = passengers.every(isPassengerValid);

  /* ===== CONTACT ===== */
  const [contact, setContact] = useState({ phone: "", email: "" });

  const isContactValid =
    /^[6-9]\d{9}$/.test(contact.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email);



  /* ===== COUPON ===== */
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

  /* ===== CALCULATIONS ===== */
  const baseFare = Number(seatFare || 0);
  const baseGST = Number(gst || 0);
  const subTotal = baseFare + baseGST - discount;

  const finalAmount = subTotal > 0 ? subTotal : 0;

  /* 🔥 SAFE TIME FORMATTER */
  const formatTime = (time) => {
    if (time === null || time === undefined) return "--:--";

    const t = String(time).padStart(4, "0");

    if (!/^\d{3,4}$/.test(t)) return "--:--";

    let hours = parseInt(t.slice(0, -2), 10);
    let minutes = parseInt(t.slice(-2), 10);

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    hours = hours % 24;

    const h12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";

    return `${h12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };
const calculateDuration = (dep, arr) => {
  if (dep == null || arr == null) return "--h --m";

  const d = String(dep).padStart(4, "0");
  const a = String(arr).padStart(4, "0");

  if (!/^\d{3,4}$/.test(d) || !/^\d{3,4}$/.test(a)) return "--h --m";

  let depH = parseInt(d.slice(0, -2), 10);
  let depM = parseInt(d.slice(-2), 10);

  let arrH = parseInt(a.slice(0, -2), 10);
  let arrM = parseInt(a.slice(-2), 10);

  // Normalize bad minutes
  if (depM >= 60) {
    depH += Math.floor(depM / 60);
    depM %= 60;
  }

  if (arrM >= 60) {
    arrH += Math.floor(arrM / 60);
    arrM %= 60;
  }

  let depMinutes = depH * 60 + depM;
  let arrMinutes = arrH * 60 + arrM;

  // Overnight trip
  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60;
  }

  const diff = arrMinutes - depMinutes;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
};

  /* ===== PAYMENT ===== */
  const handleContinue = async () => {
    if (!isAllPassengersValid || !isContactValid) {
      alert("Fill all passenger and contact details correctly.");
      return;
    }

    if (!passengers.some((p) => p.primary)) {
      passengers[0].primary = true;
    }

    try {
      const genderMap = { Male: "M", Female: "F", Other: "O" };

      const blockPayload = {
        availableTripId: tripData.availableTripId,
        boardingPointId: safeBoarding.bpId,
        droppingPointId: safeDropping.bpId,
        source: tripData.source,
        destination: tripData.destination,
        inventoryItems: normalizedSeats.map((seatObj, idx) => ({
          seatName: seatObj.seatName,
          fare: Number(seatObj.fare),
          passenger: {
            name: passengers[idx].name.trim(),
            age: Number(passengers[idx].age),
            gender: genderMap[passengers[idx].gender] || "O",
            mobile: contact.phone,
            idType: passengers[idx].idType,
            idNumber: passengers[idx].idNumber,
            primary: passengers[idx].primary,
          },
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/block-ticket",
        blockPayload
      );

      if (!res.data.success) {
        alert("Seat blocking failed");
        return;
      }

      const bookingData = {
        bookingId: res.data.bookingId,
        blockKey: res.data.blockKey,
        expiresAt: res.data.expiresAt,
        totalAmount: finalAmount,
        tripData,
        bus,
        from,
        to,
        date,
        passengers,
        contact,
        seats: normalizedSeats,
      };

      localStorage.setItem("bookingSession", JSON.stringify(bookingData));
      navigate("/payment", { state: bookingData });
    } catch (err) {
      alert("Seat blocking failed");
    }
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
                <h1 className="tb-bus-name">{bus.travels}</h1>
                <span className="tb-bus-type">{bus.type || "Seater"}</span>
              </div>
              <span className="tb-date">{date}</span>
            </div>

            <div className="tb-time-row">
              <div>
                <div className="tb-time">{formatTime(bus.departureTime)}</div>
                <div className="tb-city">{from.name}</div>
              </div>
              <div className="tb-duration">
                <span>
  {calculateDuration(bus.departureTime, bus.arrivalTime)}
</span>

                <div className="tb-line" />
              </div>
              <div>
                <div className="tb-time">{formatTime(bus.arrivalTime)}</div>
                <div className="tb-city">{to.name}</div>
              </div>
            </div>

            <div className="tb-point-row">
              <span>
                📍 Boarding:{" "}
                <b>
                  {safeBoarding.location} ({formatTime(safeBoarding.time)})
                </b>
              </span>
              <span>
                📍 Dropping:{" "}
                <b>
                  {safeDropping.location} ({formatTime(safeDropping.time)})
                </b>
              </span>
            </div>

            <div className="tb-seat-layout">
              {normalizedSeats.map((s) => (
                <span key={s.seatName} className="tb-seat">
                  Seat {s.seatName}
                </span>
              ))}
            </div>
          </div>

          {/* PASSENGERS FORM */}
          {passengers.map((p, i) => (
            <div key={p.seatName} className="tb-card tb-passenger-card">
              <div className="tb-passenger-header">
                <span className="tb-seat-chip">Seat {p.seatName}</span>
                <span className={`tb-status ${isPassengerValid(p) ? "valid" : ""}`}>
                  {isPassengerValid(p) ? "✔" : "○"}
                </span>
              </div>
              <div className="tb-form-grid">
                <select
                  className={p.errors.title ? "error" : ""}
                  value={p.title}
                  onChange={(e) => handlePassengerChange(i, "title", e.target.value)}
                >
                  <option value="">Title</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                  <option>Miss</option>
                </select>

                <input
                  placeholder="Full Name"
                  className={p.errors.name ? "error" : ""}
                  value={p.name}
                  onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Age"
                  className={p.errors.age ? "error" : ""}
                  value={p.age}
                  onChange={(e) => handlePassengerChange(i, "age", e.target.value)}
                />

                <select
                  className={p.errors.gender ? "error" : ""}
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(i, "gender", e.target.value)}
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <select
                  className={p.errors.idType ? "error" : ""}
                  value={p.idType}
                  onChange={(e) => handlePassengerChange(i, "idType", e.target.value)}
                >
                  <option value="">ID Type</option>
                  <option>Passport</option>
                  <option>Driving License</option>
                  <option>Aadhaar</option>
                  <option>Voter ID</option>
                </select>

                <input
                  placeholder="ID Number"
                  className={p.errors.idNumber ? "error" : ""}
                  value={p.idNumber}
                  onChange={(e) => handlePassengerChange(i, "idNumber", e.target.value)}
                />

                <select
                  className={p.errors.bookingType ? "error" : ""}
                  value={p.bookingType}
                  onChange={(e) =>
                    handlePassengerChange(i, "bookingType", e.target.value)
                  }
                >
                  <option value="">Booking Type</option>
                  <option>Regular</option>
                  <option>Senior Citizen</option>
                  <option>Student</option>
                  <option>Other</option>
                </select>

                <label
  className={`tb-primary-toggle ${p.primary ? "active" : ""}`}
>
  <input
    type="checkbox"
    checked={p.primary}
    onChange={(e) =>
      handlePassengerChange(i, "primary", e.target.checked)
    }
  />
  Primary
</label>


                <textarea
                  placeholder="Address"
                  className={p.errors.address ? "error" : ""}
                  value={p.address}
                  onChange={(e) => handlePassengerChange(i, "address", e.target.value)}
                />
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
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              />
              <input
                placeholder="Email ID"
                className={!isContactValid && contact.email ? "error" : ""}
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>
          </div>

          
        </div>

        {/* RIGHT COLUMN */}
        <div className="tb-right">
          <div className="tb-card tb-sticky">
            <h3>Fare Summary</h3>

            <div className="tb-fare-row">
              <span>Seat Fare</span>
              <span>₹{finalAmount}</span>
            </div>

            

            {discount > 0 && (
              <div className="tb-fare-row success">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="tb-fare-row">
              <span>GST (5%)</span>
              <span>₹{baseGST}</span>
            </div>

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
