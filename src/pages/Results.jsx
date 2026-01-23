import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaSnowflake, FaChair, FaBed, FaFire, FaFilter } from "react-icons/fa";
import SeatLayout from "../components/SeatLayout";
import "./Results.css";

/* ===================== FILTER COMPONENT ===================== */
function BusFilter({ buses, onFilter, toggleMobile }) {
  const [busType, setBusType] = useState("");

  useEffect(() => {
    let filtered = [...buses];

    if (busType) {
      filtered = filtered.filter(b =>
        b.busType?.toLowerCase().includes(busType.toLowerCase())
      );
    }

    onFilter(filtered);
  }, [busType, buses, onFilter]);

  return (
    <div className="filterContent">
      <div className="filterHeader">
        <h4>Bus Type</h4>
        {toggleMobile && (
          <button className="closeBtn" onClick={toggleMobile}>✕</button>
        )}
      </div>

      {[
        { key: "AC", label: "AC", icon: <FaSnowflake /> },
        { key: "SEATER", label: "Seater", icon: <FaChair /> },
        { key: "NON-AC", label: "Non AC", icon: <FaFire /> },
        { key: "SLEEPER", label: "Sleeper", icon: <FaBed /> }
      ].map(t => (
        <button
          key={t.key}
          className={`filterBtn ${busType === t.key ? "active" : ""}`}
          onClick={() => setBusType(busType === t.key ? "" : t.key)}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

/* ===================== RESULTS PAGE ===================== */
export default function Results() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [openBusId, setOpenBusId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

useEffect(() => {
  const fetchBuses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buses/search?${params.toString()}`
      );
      setBuses(res.data);
      setFilteredBuses(res.data);
    } catch (err) {
      console.error("Fetch buses failed:", err);
      setBuses([]);
      setFilteredBuses([]);
    } finally {
      setLoading(false);
    }
  };
  fetchBuses();
}, [search]);


  if (loading) return <div className="loading">Loading buses…</div>;

  return (
    <div className="resultsPage">
      <aside className={`filterSidebar ${showFilter ? "open" : ""}`}>
        <BusFilter
          buses={buses}
          onFilter={setFilteredBuses}
          toggleMobile={() => setShowFilter(false)}
        />
      </aside>

      <main className="resultsMain">
        <div className="mobileFilterToggle">
          <button onClick={() => setShowFilter(true)}>
            <FaFilter /> Filter
          </button>
        </div>

        {filteredBuses.map(bus => {
          const seatsLeft =
            bus.seats?.filter(s => s.status === "available").length || 0;

          return (
            <motion.div key={bus._id} layout className="busCard">
              <div className="busInfo">
                <div className="busDetails">
                  <h4>{bus.busName}</h4>
                  <p>{bus.busType}</p>
                  {bus.rating && <span className="rating">★ {bus.rating}</span>}
                </div>

                <div className="busTiming">
                  <div className="timeBlock">
                    <b>{bus.departureTime}</b>
                    <p>{bus.from}</p>
                  </div>
                  <div className="duration">{bus.duration}</div>
                  <div className="timeBlock">
                    <b>{bus.arrivalTime}</b>
                    <p>{bus.to}</p>
                  </div>
                </div>

                <div className="fareSection">
                  <div className="price">
                    {bus.originalFare && <s>₹{bus.originalFare}</s>}
                    <b>₹{bus.fare}</b>
                  </div>
                  <button
                    className="selectSeatsBtn"
                    onClick={() =>
                      setOpenBusId(openBusId === bus._id ? null : bus._id)
                    }
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


