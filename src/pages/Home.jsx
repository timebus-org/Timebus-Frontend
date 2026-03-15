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

// SORT ALPHABETICALLY
const sortedCities = cityArray.sort((a, b) =>
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

  const filterFromCities = (value) => {
  setFromText(value);
  setFrom(null);

  const filtered = cities
    .filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  setFilteredFromCities(filtered);
};

  const filterToCities = (value) => {
  setToText(value);
  setTo(null);

  const search = value.toLowerCase();

  const filtered = cities
  .filter((c) =>
    c.name.toLowerCase().startsWith(search)
  )
  .slice(0, 20);

  setFilteredToCities(filtered);
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

      const response = await fetch("http://localhost:5000/search", {
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

      localStorage.setItem(
        "recentBusSearches",
        JSON.stringify(updated)
      );

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
      {/* Top Wave */}
      <svg
        className="wave top"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C80,20 160,20 240,40 320,60 400,60 480,40
             560,20 640,20 720,40 800,60 880,60 960,40
             1040,20 1120,20 1200,40 1280,60 1360,60 1440,40 L1440,0 L0,0 Z"
        />
      </svg>

      {/* Content */}
      <div className="content">
        <div className="text">
          <h1>Your journey starts here</h1>
<p>Book your first bus ticket with TimeBus</p>

        </div>

        <div className="image">
          <img
  src={peopleIllustration}
  alt="Happy travelers"
/>

        </div>
      </div>

      {/* Bottom Wave */}
      <svg
        className="wave bottom"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 C80,40 160,40 240,20 320,0 400,0 480,20
             560,40 640,40 720,20 800,0 880,0 960,20
             1040,40 1120,40 1200,20 1280,0 1360,0 1440,20 L1440,60 L0,60 Z"
        />
      </svg>
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

                <FaBus />
                <input
                  style={input}
                  placeholder="From"
                  value={fromText}
                  onFocus={() => {
  setFilteredFromCities(cities);
  setOpenFrom(true);
}}
                  onChange={(e) => filterFromCities(e.target.value)}
                />
                {openFrom && (
                  <div style={dropdown}>
                    {filteredFromCities.slice(0, 20).map((city) => (
                      <div
  key={city.id}
  style={option}
  onMouseEnter={(e) =>
    (e.target.style.background = "#f1f5f9")
  }
  onMouseLeave={(e) =>
    (e.target.style.background = "#fff")
  }
  onClick={() => {
    setFrom(city);
    setFromText(city.name);
    setOpenFrom(false);
  }}
>
  <FaMapMarkerAlt style={{ marginRight: 8, color: "#2563eb" }} />
  {city.name}
</div>
                    ))}
                  </div>
                )}
              </div>

              <button
               className="swap-mobile hide-swap-mobile"
                style={{
                  ...swapBtn,
                  transform: rotating
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                }}
                onClick={swapCities}
              >
                <FaExchangeAlt />
              </button>

              <div style={field} ref={toRef}>
                <FaBus />
                <input
                  style={input}
                  placeholder="To"
                  value={toText}
                  onFocus={() => {
  setFilteredToCities(cities);
  setOpenTo(true);
}}
                  onChange={(e) => filterToCities(e.target.value)}
                />
                {openTo && (
                  <div style={dropdown}>
                    {filteredToCities.slice(0, 20).map((city) => (
                      <div
  key={city.id}
  style={option}
  onMouseEnter={(e) =>
    (e.target.style.background = "#f1f5f9")
  }
  onMouseLeave={(e) =>
    (e.target.style.background = "#fff")
  }
  onClick={() => {
    setTo(city);
    setToText(city.name);
    setOpenTo(false);
  }}
>
  <FaMapMarkerAlt style={{ marginRight: 8, color: "#2563eb" }} />
  {city.name}
</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2 */}
            <div style={{ ...row, marginTop: 16 }} className="row-mobile">

              <div style={field}>
                <FaCalendarAlt />
                <div style={{ ...field, justifyContent: "space-between" }}>

  {/* Visible Formatted Date */}
  <input
    style={{
      ...input,
      cursor: "pointer"
    }}
    type="text"
    value={formatDisplayDate(date)}
    readOnly
  />

  {/* Calendar Icon on Right */}
  <FaCalendarAlt
    style={{
      cursor: "pointer",
      fontSize: 20,
      color: "#2563eb"
    }}
    onClick={() =>
      document.getElementById("realDatePicker").showPicker()
    }
  />

  {/* Hidden Real Date Picker */}
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

              <div style={pillWrapper}>
                {[
                  { label: "Today", value: today },
                  { label: "Tomorrow", value: tomorrow }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setDate(item.value)}
                    style={{
                      ...pillBtn,
                      background:
                        date === item.value
                          ? "#2563eb"
                          : "transparent",
                      color:
                        date === item.value ? "#fff" : "#000"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                
                type="button"
                className="search-btn-mobile"
                style={{
                  width: "100%",
                  height: 60,
                  borderRadius: 16,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow:
                    "0 6px 20px rgba(37, 99, 235, 0.3)"
                }}
                onClick={searchHandler}
                disabled={loading}
              >
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
    {popularRoutes.map(r => (
      <div
        key={r.title}
        style={routeCard}
        onClick={() => {
  // Split the title into from → to
  const [fromCity, toCity] = r.title.split(" → ");

  // Autofill fields
  setFrom(fromCity);
  setTo(toCity);

  const today = new Date().toISOString().split("T")[0];
  setDate(today);

  // Scroll to top smoothly
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
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
    image:
      chen
  },
  {
    title: "Bangalore → Hyderabad",
    price: "₹499",
    image:
      hyd
  },
  {
    title: "Mumbai → Pune",
    price: "₹299",
    image: mumPunImage
  },
  {
    title: "Delhi → Jaipur",
    price: "₹349",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
  }
];



/* ================= STYLES ================= */

const hero = { minHeight: "100vh", background: "#000080" };

const heroGrid = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "60px 20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 40
};

const heading = { color: "#fff", fontSize: 40 };

const searchCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 20
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
  gap: 10,
  background: "#f8fafc",
  padding: "16px 18px",
  borderRadius: 14,
  position: "relative",
  alignItems: "center",
  minHeight: 60
};

const input = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: 15,
  background: "transparent"
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
  transition: "all 0.4s ease"
};

const dropdown = {
  position: "absolute",
  top: "110%",
  left: 0,
  right: 0,
  background: "#fff",
  borderRadius: 12,
  maxHeight: 220,
  overflowY: "auto",
  zIndex: 99,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  animation: "dropdownFade 0.25s ease"
};

const option = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
  transition: "all 0.2s ease"
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
  transition: "all 0.3s ease"
};

const rightImage = {
  minHeight: 350,
  borderRadius: 25,
  backgroundSize: "cover",
  backgroundPosition: "center"
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
  marginBottom: 24
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
  cursor: "pointer" // indicates interactivity
};

// Hover effect (can be applied via React inline style or CSS)
const routeCardHover = {
  transform: "translateY(-8px)", // slight lift
  boxShadow: "0 30px 60px rgba(0,0,0,0.2)" // stronger shadow on hover
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
  fontWeight: 600,
  marginBottom: 8
};

const routeMeta = {
  display: "flex",
  justifyContent: "space-between",
  color: "#475569"
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
  background: "linear-gradient(135deg, #f0f4ff, #d9e4ff)", // soft gradient for professional look
  borderRadius: "12px",
  padding: "16px 12px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)", // slightly stronger shadow
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: "220px",
  color: "#0d1b47", // text color professional dark blue
  fontWeight: 500
};

// Optional hover effect to add professional interactivity
const trustCardHover = {
  transform: "translateY(-6px)",
  boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
  background: "linear-gradient(135deg, #e0ebff, #c7d7ff)" // subtle hover color shift
};




const iconStyle = {
  color: "#2563eb",
  marginBottom: "10px"
};

const aboutSection = {
  padding: "60px 20px",
  backgroundColor: "#f8fafc", // light subtle background for contrast
  display: "flex",
  justifyContent: "center"
};

const aboutContainer = {
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "left",
  backgroundColor: "#ffffff",
  borderRadius: "16px", // rounded corners
  padding: "40px 30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)", // soft professional shadow
  lineHeight: "1.6"
};

const aboutTitle = {
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "20px",
  color: "#0f172a",
  textAlign: "center" // makes title centered and neat
};

const aboutText = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#475569",
  marginBottom: "16px"
};




