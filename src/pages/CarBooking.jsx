import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCar,
} from "react-icons/fa";
import "./CarBooking.css";
import carImage from "./cab-hero.jpg";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

/* ✅ MAJOR INDIAN CITIES */
const cities = [
  "Chennai","Bangalore","Hyderabad","Mumbai","Delhi","Pune","Kolkata",
  "Coimbatore","Madurai","Trichy","Salem","Erode","Tirunelveli",
  "Vellore","Thanjavur","Kanchipuram","Tiruppur",
  "Ahmedabad","Surat","Vadodara","Rajkot",
  "Jaipur","Udaipur","Jodhpur","Kota",
  "Kochi","Trivandrum","Calicut","Thrissur",
  "Thoothukudi","Nagercoil",
  "Vijayawada","Vizag","Guntur","Nellore",
  "Bhubaneswar","Cuttack",
  "Patna","Gaya",
  "Ranchi","Jamshedpur",
  "Indore","Bhopal","Gwalior",
  "Nagpur","Aurangabad",
  "Amritsar","Ludhiana","Chandigarh",
  "Dehradun","Haridwar","Rishikesh",
  "Shimla","Manali",
  "Srinagar","Jammu",
  "Guwahati","Shillong",
  "Agartala","Aizawl","Imphal","Gangtok"
];

/* ✅ TIME UTILITIES */
const generateTimeSlots = (interval = 15) => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      slots.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
  }
  return slots;
};

const getNext15MinSlot = () => {
  const now = new Date();
  const rounded = Math.ceil(now.getMinutes() / 15) * 15;
  now.setMinutes(rounded);
  now.setSeconds(0);
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
};

export default function CarBooking() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("outstation");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [localCity, setLocalCity] = useState("");
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const isDesktop = window.innerWidth >= 768;
  const timeSlots = generateTimeSlots();

  /* ✅ Auto set next available time on desktop */
  useEffect(() => {
    if (isDesktop && !time) {
      setTime(getNext15MinSlot());
    }
  }, [isDesktop, time]);

  const handleSearch = () => {
    navigate("/carSearchResults", {
      state: {
        tripType,
        from: tripType === "local" ? fromPlace : fromCity,
        to: tripType === "local" ? toPlace : toCity,
        city: localCity,
        date,
        time,
      },
    });
  };

  return (
    <div className="booking-bg">
      <div className="booking-card">

        {/* LEFT */}
        <div className="booking-left">
          <h2><FaCar /> Book a Cab</h2>

          {/* TOGGLE */}
          <div className="trip-toggle">
            <button
              className={tripType === "outstation" ? "active" : ""}
              onClick={() => setTripType("outstation")}
            >
              Outstation
            </button>
            <button
              className={tripType === "local" ? "active" : ""}
              onClick={() => setTripType("local")}
            >
              Local
            </button>
          </div>

          {/* OUTSTATION */}
          {tripType === "outstation" && (
            <>
              <div className="input-box">
                <FaMapMarkerAlt />
                <select value={fromCity} onChange={e => setFromCity(e.target.value)}>
                  <option value="">From City</option>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="input-box">
                <FaMapMarkerAlt />
                <select value={toCity} onChange={e => setToCity(e.target.value)}>
                  <option value="">To City</option>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          {/* LOCAL */}
          {tripType === "local" && (
            <>
              <div className="input-box">
                <FaMapMarkerAlt />
                <select value={localCity} onChange={e => setLocalCity(e.target.value)}>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="input-box">
                <FaMapMarkerAlt />
                <input
                  placeholder="From Place"
                  value={fromPlace}
                  onChange={e => setFromPlace(e.target.value)}
                />
              </div>

              <div className="input-box">
                <FaMapMarkerAlt />
                <input
                  placeholder="To Place"
                  value={toPlace}
                  onChange={e => setToPlace(e.target.value)}
                />
              </div>
            </>
          )}

         <div className="date-time-row">

  {/* DATE */}
  <div className="input-box half">
    <FaCalendarAlt />
    <Flatpickr
      value={date}
      options={{
        dateFormat: "d-m-Y",
        allowInput: true,
        minDate: "today",
      }}
      placeholder="DD-MM-YYYY"
      onChange={(_, dateStr) => setDate(dateStr)}
      className="date-input"
    />
  </div>

  {/* TIME */}
  <div className="input-box half">
    <FaClock />
    {isDesktop ? (
      <select
        value={time}
        onChange={e => setTime(e.target.value)}
        className="time-dropdown small-input"
      >
        {timeSlots.map(slot => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>
    ) : (
      <input
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="small-input"
      />
    )}
  </div>

</div>



          <button className="search-btn" onClick={handleSearch}>
            SEARCH CABS
          </button>
        </div>

        {/* RIGHT */}
        <div className="booking-right">
          <img src={carImage} alt="Cab" />
        </div>

      </div>
    </div>
  );
}
