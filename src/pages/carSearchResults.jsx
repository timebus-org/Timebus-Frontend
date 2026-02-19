import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUsers, FaSnowflake } from "react-icons/fa";
import { supabase } from "../supabaseClient";
import "./carSearchResults.css";

const allCabs = [
  {
    id: 1,
    name: "Etios",
    type: "Sedan",
    desc: "Comfortable Sedan, perfect for city travel",
    seats: 4,
    ac: true,
    image: "/images/etios.png",
    packages: {
      local: { hours: 5, kms: 50, price: 1400, extraHour: 280, extraKm: 14 },
      outstation: { perKm: 14, driver: 600 },
    },
    partner: "Timebus Verified",
  },
  {
    id: 2,
    name: "Crysta",
    type: "SUV",
    desc: "Luxury SUV, ideal for long trips",
    seats: 6,
    ac: true,
    image: "/images/crysta.png",
    packages: {
      local: { hours: 5, kms: 50, price: 2100, extraHour: 420, extraKm: 21 },
      outstation: { perKm: 21, driver: 700 },
    },
    partner: "Premium Partner",
  },
  {
    id: 3,
    name: "Innova",
    type: "SUV",
    desc: "Spacious SUV, perfect for family trips",
    seats: 6,
    ac: true,
    image: "/images/innova.png",
    packages: {
      local: { hours: 5, kms: 50, price: 1800, extraHour: 360, extraKm: 18 },
      outstation: { perKm: 18, driver: 700 },
    },
    partner: "Premium Partner",
  },
];

export default function CarSearchResults() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get search data from previous page
  const searchData = location.state || {};
  const {
    from = "Pickup Location",
    to = "Drop Location",
    date = "Select Date",
    time = "Select Time",
    tripType: initialTripType = "outstation",
  } = searchData;

  const [tripType] = useState(initialTripType); // tripType from previous search

  // 🔹 Filters state
  const [filters, setFilters] = useState({
    sedan: false,
    suv: false,
  });

  // 🔹 Filter logic
  const filteredCabs = allCabs.filter((cab) => {
    if (filters.sedan && !filters.suv && cab.type !== "Sedan") return false;
    if (filters.suv && !filters.sedan && cab.type !== "SUV") return false;
    if (filters.sedan && filters.suv) return true; // show all if both selected
    if (!filters.sedan && !filters.suv) return true; // show all if none selected
    return true;
  });

  // 🔹 Handle booking
  const handleBookWrapper = (cab) => {
    handleBook(cab).catch((err) => console.error(err));
  };

  const handleBook = async (cab) => {
    const cabData = {
      cab,
      selectedPackage: cab.packages[tripType],
      tripType,
      from,
      to,
      date,
      time, // ✅ Pass time to BookingSummary
    };

    // 🔹 Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate("/login", {
        state: { redirectTo: "/bookingSummary", cabData },
      });
    } else {
      navigate("/bookingSummary", { state: cabData });
    }
  };

  return (
    <div className="results-bg">
      {/* SEARCH SUMMARY */}
      <div className="results-summary">
        <div>
          <h3>{from} → {to}</h3>
          <p>{date} • {time} • {tripType === "local" ? "Local Trip" : "Outstation Trip"}</p>
        </div>
      </div>

      <div className="results-container">
        {/* FILTERS */}
        <div className="filters">
          <h4>Filters</h4>

          <label>
            <input
              type="checkbox"
              checked={filters.sedan}
              onChange={() => setFilters(f => ({ ...f, sedan: !f.sedan }))}
            />
            Sedan
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.suv}
              onChange={() => setFilters(f => ({ ...f, suv: !f.suv }))}
            />
            SUV
          </label>
        </div>

        {/* RESULTS */}
        <div className="results-list">
          {filteredCabs.map((cab) => {
            const localPkg = cab.packages.local;
            const outPkg = cab.packages.outstation;

            return (
              <div className="cab-result" key={cab.id}>
                <img src={cab.image} alt={cab.name} className="cab-img" />

                <div className="cab-info">
                  <h4>{cab.name} / {cab.ac ? "AC" : "Non-AC"}</h4>
                  <p>{cab.desc}</p>

                  <div className="cab-meta">
                    <span><FaUsers /> {cab.seats} Seats</span>
                    {cab.ac && <span><FaSnowflake /> AC</span>}
                  </div>

                  <h5 className="package-title">
                    {tripType === "local" ? "Local Package" : "Outstation Package"}
                  </h5>

                  {tripType === "local" ? (
                    <div className="cab-package">
                      <p>• {localPkg.hours} Hrs / {localPkg.kms} Kms – ₹{localPkg.price}</p>
                      <p>• Extra Hour – ₹{localPkg.extraHour}</p>
                      <p>• Extra Km – ₹{localPkg.extraKm}</p>
                    </div>
                  ) : (
                    <div className="cab-package">
                      <p>• ₹{outPkg.perKm} Per Km</p>
                      <p>• Driver Allowance – ₹{outPkg.driver} / Day</p>
                      <p>• Minimum 250 Kms / Day</p>
                    </div>
                  )}

                  <small>{cab.partner}</small>
                </div>

                <div className="cab-price">
                  <h3>
                    ₹{tripType === "local" ? localPkg.price : outPkg.perKm}/
                    {tripType === "local" ? "pkg" : "km"}
                  </h3>

                  <button onClick={() => handleBookWrapper(cab)}>BOOK NOW</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
