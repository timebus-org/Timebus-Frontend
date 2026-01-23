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

import indianCities from "./indianCities.json";
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


  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(today);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [filteredCities, setFilteredCities] = useState(indianCities);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const debounceRef = useRef(null);

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  const filterCities = (query) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilteredCities(
        query
          ? indianCities.filter(c =>
              c.toLowerCase().includes(query.toLowerCase())
            )
          : indianCities
      );
    }, 250);
  };

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

  
  const searchHandler = () => {
  if (!from || !to) {
    alert("Please select cities");
    return;
  }

  navigate(`/results?from=${from}&to=${to}&date=${date}`);
};

  const setToday = () => {
  const today = new Date().toISOString().split("T")[0];
  setDate(today);
};

const setTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  setDate(tomorrow.toISOString().split("T")[0]);
};


 const formatDate = (d) => {
    const dateObj = new Date(d);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`; // DD/MM/YYYY
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



  return (
    <>
      {/* ================= HERO (UNCHANGED) ================= */}
      <section style={hero} className="hero">
        <div style={heroGrid} className="heroGrid">
          <div style={leftContainer}>
            <h1 style={heading}>Book Bus Tickets Online</h1>

            <div style={searchCard}>
              <div style={row} className="searchRow">
                <div style={field} ref={fromRef}>
                  <FaBus />
                  <input
                    style={input}
                    placeholder="From"
                    value={from}
                    onFocus={() => setOpenFrom(true)}
                    onChange={e => {
                      setFrom(e.target.value);
                      filterCities(e.target.value);
                    }}
                  />
                  {openFrom && (
                    <div style={dropdown}>
                      {filteredCities.map(city => (
                        <div
                          key={city}
                          style={option}
                          onClick={() => {
                            setFrom(city);
                            setOpenFrom(false);
                          }}
                        >
                          <span>{city}</span>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button style={swapBtn} className="swapBtn" onClick={swapCities}>
                  <FaExchangeAlt />
                </button>

                <div style={field} ref={toRef}>
                  <FaBus />
                  <input
                    style={input}
                    placeholder="To"
                    value={to}
                    onFocus={() => setOpenTo(true)}
                    onChange={e => {
                      setTo(e.target.value);
                      filterCities(e.target.value);
                    }}
                  />
                  {openTo && (
                    <div style={dropdown}>
                      {filteredCities.map(city => (
                        <div
                          key={city}
                          style={option}
                          onClick={() => {
                            setTo(city);
                            setOpenTo(false);
                          }}
                        >
                          <span>{city}</span>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ ...field, flexDirection: "column", alignItems: "flex-start" }}>
  <span style={{ fontSize: 12, color: "#475569", marginBottom: "auto" }}>
    Journey Date
  </span>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      gap: 10
    }}
  >
    {/* LEFT SIDE: calendar + date */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          position: "relative"
        }}
      >
        <FaCalendarAlt />
        <input
          type="date"
          min={today}
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer"
          }}
        />
      </div>

      <span style={{ fontWeight: 600 }}>
        {formatDate(date)}
      </span>
    </div>

    {/* RIGHT SIDE: buttons */}
    <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
      <button
        type="button"
        onClick={setToday}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #2563eb",
          background: date === today ? "#2563eb" : "#fff",
          color: date === today ? "#fff" : "#2563eb",
          fontSize: 12,
          cursor: "pointer"
        }}
      >
        Today
      </button>

      <button
        type="button"
        onClick={setTomorrow}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #2563eb",
          background:
            date ===
            new Date(Date.now() + 86400000).toISOString().split("T")[0]
              ? "#2563eb"
              : "#fff",
          color:
            date ===
            new Date(Date.now() + 86400000).toISOString().split("T")[0]
              ? "#fff"
              : "#2563eb",
          fontSize: 12,
          cursor: "pointer"
        }}
      >
        Tomorrow
      </button>
    </div>
  </div>
</div>





                <div style={{ width: "100%" }}>
  <button
    style={{
      ...searchBtn,
      width: "100%",
      justifyContent: "center"
    }}
    onClick={searchHandler}
  >
    <FaSearch /> Search Buses
  </button>
</div>

              </div>
            </div>
          </div>

          <div
            style={{
  ...rightImage,
  backgroundImage: `url(${busImage})` // only the image
}}

          className="heroImage"/>
        </div>
      </section>

      {/* ================= POPULAR ROUTES (IMAGE BASED) ================= */}
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
          setFrom(fromCity);   // autofill From box
          setTo(toCity);       // autofill To box
          const today = new Date().toISOString().split("T")[0];
          setDate(today);      // default today
          navigate(`/results?from=${fromCity}&to=${toCity}&date=${today}`);
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

/* ================= DATA ================= */

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


const hero = {
  minHeight: "92vh",
  background: "#000080" // sky blue
};


const heroGrid = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "80px 24px",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 40,
  alignItems: "center"
};

const heading = {
  color: "#fff",
  fontSize: 42,
  marginBottom: 32
};

const searchCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  boxShadow: "0 30px 80px rgba(0,0,0,.35)"
};

const row = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap"
};

const field = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#eff6ff",
  padding: "14px 16px",
  borderRadius: 12,
  position: "relative",
  minWidth: 180
};

const input = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%"
};



const swapBtn = {
  height: 44,
  width: 44,
  borderRadius: "50%",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const dropdown = {
  position: "absolute",
  top: "110%",
  left: 0,
  right: 0,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
  maxHeight: 220,
  overflowY: "auto",
  zIndex: 50
};

const option = {
  padding: "12px 16px",
  cursor: "pointer",
  display: "flex",
  gap: 8
};

const searchBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "14px 28px",
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  display: "flex",
  gap: 8,
  alignItems: "center"
};

const rightImage = {
  minHeight: 320,
  borderRadius: 25,
  
  backgroundSize: "cover",
  backgroundPosition: "center"
  
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
const leftContainer = {
  background: "rgba(255, 255, 255, 0.08)", // subtle glass look
  backdropFilter: "blur(6px)",
  backgroundColor: "rgba(0,0,0,0.25)",
  padding: "28px",
  borderRadius: "20px"
};





