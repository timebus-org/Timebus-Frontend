import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaPhoneAlt, FaClipboardList } from "react-icons/fa";
import { supabase } from "../supabaseClient";

import logo from "../assets/logo.png";
import busIcon from "../assets/bus.png";
import cbIcon from "../assets/cab.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/login");
  };

  const registeredName = user?.user_metadata?.full_name;

  // Bus tab active on "/" or "/bus-tickets"
  const isBusActive = location.pathname === "/" || location.pathname === "/bus-tickets";

  // Styles function for NavLink active state
  const tabActive = ({ isActive }) => ({
    textDecoration: "none",
    color: isBusActive && isActive ? "#1976d2" : isActive ? "#1976d2" : "#1f2937",
    borderBottom: isBusActive && isActive ? "3px solid #1976d2" : isActive ? "3px solid #1976d2" : "3px solid transparent",
    paddingBottom: "6px",
    transition: "all 0.25s ease",
  });

  return (
    <>
      <nav style={navBar} className="navBar">
        <div style={leftWrap} className="leftWrap">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: "46px" }} />
          </Link>

          <div style={tabGroup} className="tabGroup">
            <NavLink to="/bus-tickets" style={() => tabActive({ isActive: true })}>
              <div style={tabItem} className="tabItem">
                <img src={busIcon} style={tabIcon} alt="Bus" />
                <span>Bus</span>
              </div>
            </NavLink>

            <NavLink to="/CarBooking" style={tabActive}>
              <div style={tabItem} className="tabItem">
                <img src={cbIcon} style={tabIcon} alt="Cabs" />
                <span>Cabs</span>
              </div>
            </NavLink>
          </div>
        </div>

        <div style={rightWrap} className="rightWrap">
          <Link to="/contact-us" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <FaPhoneAlt /> <span className="hide-sm">Help</span>
          </Link>

          <Link to="/print-ticket" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <FaClipboardList /> <span className="hide-sm">Print Ticket</span>
          </Link>

          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div onClick={() => setOpen(!open)} style={accountBtn}>
              <FaUserCircle size={20} />
              <span className="hide-sm">
                {registeredName ? `Hello, ${registeredName}` : "Account"}
              </span>
              <span style={{ marginLeft: 4 }}>▼</span>
            </div>

            <div
              style={{
                ...dropdown,
                opacity: open ? 1 : 0,
                transform: open ? "scale(1)" : "scale(0.95)",
                pointerEvents: open ? "auto" : "none",
              }}
            >
              {user ? (
                <>
                  <div
                    style={dropItem}
                    onClick={() => {
                      setOpen(false);
                      navigate("/cancel-ticket");
                    }}
                  >
                    Cancel Ticket
                  </div>
                  <div
                    style={dropItem}
                    onClick={() => {
                      setOpen(false);
                      navigate("/reschedule-ticket");
                    }}
                  >
                    Reschedule Ticket
                  </div>
                  <div
                    style={{ ...dropItem, color: "#d32f2f", fontWeight: 700 }}
                    onClick={logout}
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={dropItem}
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </div>
                  <div
                    style={dropItem}
                    onClick={() => {
                      setOpen(false);
                      navigate("/signup");
                    }}
                  >
                    Signup
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add the mobile CSS here or in your global CSS file */}
      <style>{`
        @media (max-width: 600px) {
          .navBar {
            flex-direction: column !important;
            height: auto !important;
            padding: 12px 16px !important;
            align-items: center !important;
          }

          .leftWrap {
            gap: 24px !important;
            flex-wrap: wrap !important;
            justify-content: center;
          }

          .tabGroup {
            gap: 24px !important;
            justify-content: center !important;
            width: 100%;
          }

          .tabItem {
            font-size: 14px !important;
            padding: 8px 6px !important;
          }

          .tabIcon {
            width: 18px !important;
            height: 18px !important;
          }

          .rightWrap {
            margin-top: 16px;
            gap: 16px !important;
            justify-content: center;
            width: 100%;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}

/* ================= STYLES ================= */

const navBar = {
  background: "#fff",
  height: "74px",
  padding: "0 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "stretch",
  borderBottom: "1px solid #e6eaf0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  fontFamily: "Inter, system-ui, sans-serif",
};

const leftWrap = {
  display: "flex",
  alignItems: "center",
  gap: "50px",
};

const tabGroup = {
  display: "flex",
  gap: "45px",
  alignItems: "flex-end",
  height: "100%",
};

const tabItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "6px",
  fontSize: "16px",
  fontWeight: 700,
  height: "100%",
};

const tabIcon = {
  width: "22px",
  height: "22px",
};

const accountBtn = {
  cursor: "pointer",
  background: "#e3f2fd",
  padding: "6px 12px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 600,
  fontSize: "15px",
  color: "#0d47a1",
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "44px",
  background: "#fff",
  width: "220px",
  borderRadius: "10px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  overflow: "hidden",
};

const dropItem = {
  padding: "12px 16px",
  cursor: "pointer",
  fontSize: "14px",
  borderBottom: "1px solid #f1f1f1",
};
const rightWrap = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
  position: "relative",
};
