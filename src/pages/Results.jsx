import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSnowflake,
  FaChair,
  FaBed,
  FaBus,
  FaFire
} from "react-icons/fa";
import SeatLayout from "../components/SeatLayout";

/* =====================
   FILTER COMPONENT
===================== */
function BusFilter({ buses, onFilter }) {
  const [busType, setBusType] = useState("");

  useEffect(() => {
    let filtered = [...buses];

    if (busType) {
      filtered = filtered.filter(b => b.busType === busType);
    }

    onFilter(filtered);
  }, [busType, buses]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h4>Bus Type</h4>

      {[
        { key: "AC", label: "AC", icon: <FaSnowflake /> },
        { key: "SEATER", label: "Seater", icon: <FaChair /> },
        { key: "NONAC", label: "Non AC", icon: <FaFire /> },
        { key: "SLEEPER", label: "Sleeper", icon: <FaBed /> }
      ].map(t => (
        <button
          key={t.key}
          onClick={() => setBusType(busType === t.key ? "" : t.key)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "1px solid #ddd",
            background: busType === t.key ? "#007bff" : "#f5f5f5",
            color: busType === t.key ? "#fff" : "#000"
          }}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

/* =====================
   RESULTS PAGE
===================== */
export default function Results() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [openBusId, setOpenBusId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchBuses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buses/search?${params.toString()}`
      );
      setBuses(res.data);
      setFilteredBuses(res.data);
    } catch (err) {
      console.error("Fetch buses error:", err);
      setBuses([]);
      setFilteredBuses([]);
    } finally {
      setLoading(false);
    }
  };

  fetchBuses();
}, [params]);


  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading buses…</div>;
  }

  return (
    <div style={{ display: "flex", gap: 30, marginTop: 40, paddingRight: 40, paddingLeft: 40 }}>

      {/* FILTER */}
      <aside
        style={{
          width: 260,
          padding: 40,
          background: "#fff",
          borderRadius: 30,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
        }}
      >
        <BusFilter buses={buses} onFilter={setFilteredBuses} />
      </aside>

      {/* RESULTS */}
      <main style={{ flex: 1 }}>
        {filteredBuses.map(bus => {
          const seatsLeft =
            bus.seats?.filter(s => s.status === "available").length || 0;

          return (
            <motion.div
              key={bus._id}
              layout
              style={{
                background: "#fff",
                padding: 26,
                borderRadius: 30,
                marginBottom: 26,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="left" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                    {bus.busName}
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>{bus.busType}</p>
                  {bus.rating && (
                    <span
                      className="rating"
                      style={{
                        fontSize: "14px",
                        color: "#ffb400",
                        fontWeight: 500
                      }}
                    >
                      ★ {bus.rating}
                    </span>
                  )}
                </div>
                <div
                  className="center"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    fontSize: "14px",
                    color: "#555"
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <b>{bus.departureTime}</b>
                    <p style={{ margin: 0 }}>{bus.from}</p>
                  </div>

                  <span
                    className="duration"
                    style={{ fontSize: "12px", color: "#888" }}
                  >
                    {bus.duration}
                  </span>

                  <div style={{ textAlign: "center" }}>
                    <b>{bus.arrivalTime}</b>
                    <p style={{ margin: 0 }}>{bus.to}</p>
                  </div>
                </div>


                <div style={{ textAlign: "right" }}>
                  <div className="price" style={{ textAlign: "right", fontSize: "14px" }}>
                    {bus.originalFare && (
                      <s style={{ color: "#888", marginRight: "6px" }}>
                        ₹{bus.originalFare}
                      </s>
                    )}
                    <b>₹{bus.fare}</b>
                  </div>
                  <button
                    onClick={() =>
                      setOpenBusId(openBusId === bus._id ? null : bus._id)
                    }
                    style={{
                      display: "block",
                      marginTop: 10,
                      padding: "6px 12px",
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Select Seats
                  </button>
                  <small>{seatsLeft} seats left</small>
                </div>
              </div>

              <AnimatePresence>
                {openBusId === bus._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <SeatLayout bus={bus} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </main>
    </div>
  );
}

