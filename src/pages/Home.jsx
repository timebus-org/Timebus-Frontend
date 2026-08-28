import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExchangeAlt,
  FaSearch,
  FaStar,
  FaLock,
  FaUsers
} from "react-icons/fa";
import FaqPage from "./FaqPage";

import busImage from "../assets/bus1.png";
import mumPunImage from "../assets/mum-pun.jpg";
import chen from "../assets/chennai-blr.jpg";
import hyd from "../assets/blr-hyd.jpg";
import "./Home.css";
import "./TimeBusBanner.css";
import peopleIllustration from "../assets/people-illustration.png";

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [rotating, setRotating] = useState(false);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [date, setDate] = useState(today);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeFromIndex, setActiveFromIndex] = useState(-1);
  const [activeToIndex, setActiveToIndex] = useState(-1);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [cities, setCities] = useState([]);
  const [filteredFromCities, setFilteredFromCities] = useState([]);
  const [filteredToCities, setFilteredToCities] = useState([]);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const getTomorrow = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  };

  const tomorrow = getTomorrow();

  const formatDisplayDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  /* ================= LOAD RECENT SEARCHES ================= */

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("recentBusSearches")) || [];
    setRecentSearches(stored);
  }, []);

  /* ================= FETCH CITIES ================= */

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cities`);
        const data = await res.json();
        const cityArray = Array.isArray(data)
          ? data
          : Array.isArray(data.cities)
          ? data.cities
          : [];

        const southStates = [
          "Tamil Nadu",
          "Karnataka",
          "Kerala",
          "Andhra Pradesh",
          "Telangana"
        ];

        const filteredSouthCities = cityArray.filter((city) =>
          southStates.includes(city.state) // backend must send "state"
        );

        const sortedCities = filteredSouthCities.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCities(sortedCities);
        setFilteredFromCities(sortedCities);
        setFilteredToCities(sortedCities);
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };
    fetchCities();
  }, []);

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {
    const close = (e) => {
      if (
        !fromRef.current?.contains(e.target) &&
        !toRef.current?.contains(e.target)
      ) {
        setOpenFrom(false);
        setOpenTo(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ================= FILTER ================= */

  const popularCityNames = [
    "Chennai",
    "Bangalore",
    "Hyderabad",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Salem",
    "Erode",
    "Tirunelveli",
    "Vellore",
    "Mysore",
    "Mangalore",
    "Vijayawada",
    "Visakhapatnam",
    "Kochi",
    "Trivandrum"
  ];

  // Only popular cities, alphabetically sorted
  const getPopularCities = () => {
    return cities
      .filter((c) => popularCityNames.includes(c.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  /* ================= FROM FILTER ================= */
  const filterFromCities = (value) => {
    setFromText(value);
    setActiveFromIndex(-1);

    const search = value.toLowerCase();

    // exclude whatever city is already selected as "To"
    const baseCities = getPopularCities().filter((c) => c.id !== to?.id);

    const filtered = baseCities.filter((c) =>
      c.name.toLowerCase().includes(search)
    );

    setFilteredFromCities(filtered);

    const exactMatch = baseCities.find(
      (c) => c.name.toLowerCase() === search
    );

    setFrom(exactMatch || null);
  };

  /* ================= TO FILTER ================= */
  const filterToCities = (value) => {
    setToText(value);
    setActiveToIndex(-1);

    const search = value.toLowerCase();

    // exclude whatever city is already selected as "From"
    const baseCities = getPopularCities().filter((c) => c.id !== from?.id);

    const filtered = baseCities.filter((c) =>
      c.name.toLowerCase().includes(search)
    );

    setFilteredToCities(filtered);

    const exactMatch = baseCities.find(
      (c) => c.name.toLowerCase() === search
    );

    setTo(exactMatch || null);
  };

  /* ================= KEYBOARD NAVIGATION ================= */
  const handleKeyDown = (e, type) => {
    const isFrom = type === "from";

    const list = isFrom ? filteredFromCities : filteredToCities;
    const activeIndex = isFrom ? activeFromIndex : activeToIndex;
    const setIndex = isFrom ? setActiveFromIndex : setActiveToIndex;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((prev) => (prev < list.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((prev) => (prev > 0 ? prev - 1 : list.length - 1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selectedCity = list[activeIndex];

      if (isFrom) {
        setFrom(selectedCity);
        setFromText(selectedCity.name);
        setOpenFrom(false);
        setOpenTo(false);

        setTimeout(() => {
          toRef.current?.querySelector("input")?.focus();
          setFilteredToCities(
            getPopularCities().filter((c) => c.id !== selectedCity.id)
          );
          setActiveToIndex(-1);
          setOpenFrom(false);
          setOpenTo(true);
        }, 100);
      } else {
        setTo(selectedCity);
        setToText(selectedCity.name);
        setOpenFrom(false);
        setOpenTo(false);
      }
    }
  };

  /* ================= SWAP ================= */

  const swapCities = () => {
    setRotating(true);

    const tempCity = from;
    const tempText = fromText;

    setFrom(to);
    setFromText(toText);
    setTo(tempCity);
    setToText(tempText);

    setTimeout(() => setRotating(false), 400);
  };

  /* ================= SEARCH ================= */

  const searchHandler = async () => {
    if (!from || !to) {
      alert("Please select valid cities");
      return;
    }
    if (from.id === to.id) {
      alert("Source and Destination cannot be same");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: Number(from.id),
          destinationId: Number(to.id),
          date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Search failed");
        return;
      }

      /* ===== SAVE RECENT SEARCH ===== */

      const newSearch = { from, to, date };

      let updated = [newSearch, ...recentSearches];

      updated = updated.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (s) =>
              s.from.id === item.from.id &&
              s.to.id === item.to.id &&
              s.date === item.date
          )
      );

      updated = updated.slice(0, 5);

      localStorage.setItem("recentBusSearches", JSON.stringify(updated));

      setRecentSearches(updated);

      /* ===== NAVIGATE ===== */

      navigate("/results", {
        state: { buses: data, from, to, date }
      });
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const TimeBusBanner = () => {
    return (
      <div className="timebus-banner">
        <svg className="wave top" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,40 C80,20 160,20 240,40 320,60 400,60 480,40
               560,20 640,20 720,40 800,60 880,60 960,40
               1040,20 1120,20 1200,40 1280,60 1360,60 1440,40 L1440,0 L0,0 Z"
          />
        </svg>

        <div className="content">
          <div className="text">
            <h1>Your journey starts here</h1>
            <p>Book your first bus ticket with TimeBus</p>
          </div>

          <div className="image">
            <img src={peopleIllustration} alt="Happy travelers" />
          </div>
        </div>

        <svg className="wave bottom" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,20 C80,40 160,40 240,20 320,0 400,0 480,20
               560,40 640,40 720,20 800,0 880,0 960,20
               1040,40 1120,40 1200,20 1280,0 1360,0 1440,20 L1440,60 L0,60 Z"
          />
        </svg>
      </div>
    );
  };

  /* ================= CITY DROPDOWN ROW ================= */
  const renderCityOption = (city, index, isFrom) => {
    const activeIndex = isFrom ? activeFromIndex : activeToIndex;
    const isActive = index === activeIndex;

    return (
      <div
        key={city.id}
        style={{
          ...option,
          backgroundColor: isActive ? "#2563eb" : "transparent",
          color: isActive ? "#fff" : "#0f172a"
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "#eef2ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isActive
            ? "#2563eb"
            : "transparent";
        }}
        onClick={() => {
          if (isFrom) {
            setFrom(city);
            setFromText(city.name);
            setOpenFrom(false);
            setOpenTo(false);

            setTimeout(() => {
              toRef.current?.querySelector("input")?.focus();
              setFilteredToCities(
                getPopularCities().filter((c) => c.id !== city.id)
              );
              setActiveToIndex(-1);
              setOpenFrom(false);
              setOpenTo(true);
            }, 100);
          } else {
            setTo(city);
            setToText(city.name);
            setOpenFrom(false);
            setOpenTo(false);
          }
        }}
      >
        <FaMapMarkerAlt size={12} color={isActive ? "#fff" : "#2563eb"} />
        <span>{city.name}</span>
      </div>
    );
  };

  /* ================= UI ================= */

  return (
    <>
      <section style={hero}>
        <div style={heroGrid} className="hero-grid-mobile">
          <div style={leftContainer}>
            <h1 style={heading}>Book Bus Tickets Online</h1>

            <div style={searchCard}>
              {/* ROW 1 */}
              <div style={row} className="row-mobile">
                <div style={field} ref={fromRef} className="field-mobile">
                  <div style={fieldInner}>
                    <span style={fieldLabel}>From</span>
                    <div style={fieldInputRow}>
                      <FaBus color="#2563eb" />
                      <input
                        style={input}
                        placeholder="Select origin city"
                        value={fromText}
                        onFocus={() => {
                          const popular = getPopularCities().filter(
                            (c) => c.id !== to?.id
                          );
                          setFilteredFromCities(popular);
                          setActiveFromIndex(-1);
                          setOpenTo(false);
                          setOpenFrom(true);
                        }}
                        onChange={(e) => filterFromCities(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "from")}
                      />
                    </div>
                  </div>

                  {openFrom && (
                    <div style={dropdown}>
                      {filteredFromCities.length === 0 && (
                        <div style={noResults}>No matching cities</div>
                      )}
                      {filteredFromCities
                        .slice(0, 20)
                        .map((city, index) => renderCityOption(city, index, true))}
                    </div>
                  )}
                </div>

                <button
                  className="swap-mobile hide-swap-mobile"
                  style={{
                    ...swapBtn,
                    transform: rotating ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                  onClick={swapCities}
                  aria-label="Swap cities"
                  type="button"
                >
                  <FaExchangeAlt />
                </button>

                <div style={field} ref={toRef}>
                  <div style={fieldInner}>
                    <span style={fieldLabel}>To</span>
                    <div style={fieldInputRow}>
                      <FaBus color="#2563eb" />
                      <input
                        style={input}
                        placeholder="Select destination city"
                        value={toText}
                        onFocus={() => {
                          const popular = getPopularCities().filter(
                            (c) => c.id !== from?.id
                          );
                          setFilteredToCities(popular);
                          setActiveToIndex(-1);
                          setOpenFrom(false);
                          setOpenTo(true);
                        }}
                        onChange={(e) => filterToCities(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "to")}
                      />
                    </div>
                  </div>

                  {openTo && (
                    <div style={dropdown}>
                      {filteredToCities.length === 0 && (
                        <div style={noResults}>No matching cities</div>
                      )}
                      {filteredToCities
                        .slice(0, 20)
                        .map((city, index) => renderCityOption(city, index, false))}
                    </div>
                  )}
                </div>
              </div>

              {/* ROW 2 */}
              <div style={{ ...row, marginTop: 16 }} className="row-mobile">
                <div style={field}>
                  <div style={fieldInner}>
                    <span style={fieldLabel}>Date of Journey</span>
                    <div style={{ ...fieldInputRow, justifyContent: "space-between" }}>
                      <input
                        style={{ ...input, cursor: "pointer" }}
                        type="text"
                        value={formatDisplayDate(date)}
                        readOnly
                      />
                      <FaCalendarAlt
                        style={{ cursor: "pointer", fontSize: 20, color: "#2563eb" }}
                        onClick={() =>
                          document.getElementById("realDatePicker").showPicker()
                        }
                      />
                      <input
                        id="realDatePicker"
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                          position: "absolute",
                          opacity: 0,
                          pointerEvents: "none"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={pillWrapper}>
                  {[
                    { label: "Today", value: today },
                    { label: "Tomorrow", value: tomorrow }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setDate(item.value)}
                      style={{
                        ...pillBtn,
                        background: date === item.value ? "#2563eb" : "transparent",
                        color: date === item.value ? "#fff" : "#0f172a"
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="search-btn-mobile"
                  style={searchBtn}
                  onClick={searchHandler}
                  disabled={loading}
                >
                  <FaSearch style={{ marginRight: 8 }} />
                  {loading ? "Searching..." : "Search Buses"}
                </button>
              </div>
            </div>
          </div>

          <div
            className="hide-mobile"
            style={{
              ...rightImage,
              backgroundImage: `url(${busImage})`
            }}
          />
        </div>
      </section>

      <section style={whiteSection}>
        <h2 style={sectionTitle}>Popular Bus Routes</h2>

        <div style={routeGrid}>
          {popularRoutes.map((r) => (
            <div
              key={r.title}
              style={routeCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onClick={() => {
                const [fromName, toName] = r.title.split(" → ");
                const fromCity = cities.find((c) => c.name === fromName);
                const toCity = cities.find((c) => c.name === toName);

                if (fromCity && toCity) {
                  setFrom(fromCity);
                  setFromText(fromCity.name);
                  setTo(toCity);
                  setToText(toCity.name);
                } else {
                  // Cities list not loaded yet / route city not in DB — at least prefill text
                  setFromText(fromName || "");
                  setToText(toName || "");
                }

                setDate(today);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div
                style={{
                  ...routeImage,
                  backgroundImage: `url(${r.image})`
                }}
              />
              <div style={routeInfo}>
                <div style={routeTitle}>{r.title}</div>
                <div style={routeMeta}>
                  <span style={routeStartingFrom}>Starting from</span>
                  <span style={routePrice}>{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TimeBusBanner />

      {/* ================= TRUST / RATINGS ================= */}
      <section style={trustSection}>
        <div style={trustGrid}>
          <div style={trustCard}>
            <FaStar size={30} style={iconStyle} />
            <strong>4.8 / 5</strong>
            <span>User Rating</span>
          </div>

          <div style={trustCard}>
            <FaBus size={30} style={iconStyle} />
            <strong>2,000+</strong>
            <span>Verified Operators</span>
          </div>

          <div style={trustCard}>
            <FaUsers size={30} style={iconStyle} />
            <strong>12M+</strong>
            <span>Happy Customers</span>
          </div>

          <div style={trustCard}>
            <FaLock size={30} style={iconStyle} />
            <strong>100%</strong>
            <span>Secure Payments</span>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section style={aboutSection}>
        <div style={aboutContainer}>
          <h2 style={aboutTitle}>About TimeBus</h2>

          <p style={aboutText}>
            TimeBus is a reliable online bus booking platform designed to simplify
            intercity travel across India. We connect passengers with verified bus
            operators and a wide range of routes, enabling seamless and dependable
            ticket booking for everyday travel needs.
          </p>

          <p style={aboutText}>
            The platform allows users to compare AC and Non-AC buses, Sleeper and
            Semi-Sleeper coaches, travel timings, boarding points, and fares in one
            place. TimeBus focuses on clarity, speed, and ease of use across both web
            and mobile devices.
          </p>

          <p style={aboutText}>
            With features such as instant ticket confirmation, live bus tracking,
            and secure digital payments, TimeBus delivers a smooth end-to-end booking
            experience. Whether traveling for business, leisure, or personal reasons,
            TimeBus ensures a comfortable and reliable journey.
          </p>
        </div>
      </section>
    </>
  );
}

const popularRoutes = [
  {
    title: "Chennai → Bangalore",
    price: "₹399",
    image: chen
  },
  {
    title: "Bangalore → Hyderabad",
    price: "₹499",
    image: hyd
  },
  {
    title: "Mumbai → Pune",
    price: "₹299",
    image: mumPunImage
  },
  {
    title: "Delhi → Jaipur",
    price: "₹349",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
  }
];

/* ================= STYLES ================= */

const hero = {
  minHeight: "100vh",
  background: "linear-gradient(160deg, #000080 0%, #0b1a63 55%, #071240 100%)"
};

const heroGrid = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "60px 20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 40
};

const heading = {
  color: "#fff",
  fontSize: 40,
  fontWeight: 700,
  letterSpacing: "-0.5px",
  marginBottom: 24
};

const searchCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 20,
  boxShadow: "0 25px 60px rgba(0,0,0,0.35)"
};

const row = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "center"
};

const field = {
  flex: 1,
  display: "flex",
  background: "#f8fafc",
  padding: "12px 18px",
  borderRadius: 14,
  position: "relative",
  alignItems: "center",
  minHeight: 66,
  border: "1px solid #eef1f6"
};

const fieldInner = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 4
};

const fieldLabel = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.4px"
};

const fieldInputRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  position: "relative"
};

const input = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: 16,
  background: "transparent",
  color: "#0f172a",
  fontWeight: 500
};

const swapBtn = {
  height: 50,
  width: 50,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  transition: "all 0.4s ease",
  boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
  flexShrink: 0
};

const dropdown = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  marginTop: 8,
  background: "#fff",
  borderRadius: 14,
  maxHeight: 280,
  overflowY: "auto",
  zIndex: 99,
  boxShadow: "0 20px 45px rgba(15,23,42,0.18)",
  border: "1px solid #eef1f6",
  display: "flex",
  flexDirection: "column",
  padding: 6,
  animation: "dropdownFade 0.2s ease"
};

const option = {
  padding: "13px 14px",
  fontSize: 15.5,
  fontWeight: 500,
  cursor: "pointer",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  gap: 10,
  borderBottom: "1px solid #f1f5f9",
  transition: "background-color 0.15s ease"
};

const noResults = {
  padding: "16px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: 14
};

const pillWrapper = {
  display: "flex",
  background: "#f1f5f9",
  padding: 4,
  borderRadius: 30
};

const pillBtn = {
  padding: "8px 18px",
  borderRadius: 30,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  transition: "all 0.3s ease"
};

const searchBtn = {
  width: "100%",
  height: 60,
  borderRadius: 16,
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0.2px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const rightImage = {
  minHeight: 350,
  borderRadius: 25,
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
};

const leftContainer = {
  backgroundColor: "rgba(0,0,0,0.25)",
  padding: "28px",
  borderRadius: "20px"
};

const whiteSection = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "56px 24px"
};

const sectionTitle = {
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 24,
  color: "#0f172a"
};

const routeGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
  gap: 24
};

const routeCard = {
  background: "#fff",
  borderRadius: 18,
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer"
};

const routeImage = {
  height: 160,
  backgroundSize: "cover",
  backgroundPosition: "center"
};

const routeInfo = {
  padding: "16px 18px"
};

const routeTitle = {
  fontWeight: 700,
  fontSize: 16,
  marginBottom: 8,
  color: "#0f172a"
};

const routeMeta = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#475569"
};

const routeStartingFrom = {
  fontSize: 12,
  color: "#94a3b8"
};

const routePrice = {
  fontSize: 16,
  fontWeight: 700,
  color: "#2563eb"
};

const trustSection = {
  padding: "40px 20px",
  backgroundColor: "#f8fafc"
};

const trustGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "30px",
  maxWidth: "1500px",
  margin: "0 auto",
  padding: "20px",
  justifyItems: "center"
};

const trustCard = {
  background: "linear-gradient(135deg, #f0f4ff, #d9e4ff)",
  borderRadius: "12px",
  padding: "16px 12px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: "220px",
  color: "#0d1b47",
  fontWeight: 500
};

const iconStyle = {
  color: "#2563eb",
  marginBottom: "10px"
};

const aboutSection = {
  padding: "60px 20px",
  backgroundColor: "#f8fafc",
  display: "flex",
  justifyContent: "center"
};

const aboutContainer = {
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "left",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "40px 30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  lineHeight: "1.6"
};

const aboutTitle = {
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "20px",
  color: "#0f172a",
  textAlign: "center"
};

const aboutText = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#475569",
  marginBottom: "16px"
};
