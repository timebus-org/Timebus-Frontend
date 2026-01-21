import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle, FaPhoneAlt, FaClipboardList } from "react-icons/fa";
import { supabase } from "../supabaseClient";

import logo from "../assets/logo.png";
import busIcon from "../assets/bus.png";
import trIcon from "../assets/train.png";
import flIcon from "../assets/flight.png";
import cbIcon from "../assets/cab.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Supabase auth (correct way)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const name =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email;

  return (
    <nav
      style={{
        background: "#ffffff",
        padding: "5px 33px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e6eaf0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* LEFT BRAND */}
      <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
        <Link to="/">
          <img src={logo} alt="Logo" style={{ height: "60px" }} />
        </Link>

        {/* NAV ITEMS */}
        <div style={{ display: "flex", gap: "35px" }}>
          <NavLink to="/bus-tickets" style={navActive}>
            <div style={navItem}>
              <img src={busIcon} width="28" />
              <span>Bus</span>
            </div>
          </NavLink>

          <NavLink to="/train-tickets" style={navActive}>
            <div style={navItem}>
              <img src={trIcon} width="35" />
              <span>Train</span>
            </div>
          </NavLink>

          <NavLink to="/CarBooking" style={navActive}>
            <div style={navItem}>
              <img src={cbIcon} width="36" />
              <span>Cab</span>
            </div>
          </NavLink>

          <NavLink to="/flight-tickets" style={navActive}>
            <div style={navItem}>
              <img src={flIcon} width="36" />
              <span>Flight</span>
            </div>
          </NavLink>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <Link to="/contact-us" style={linkStyle}>
          <FaPhoneAlt /> Help
        </Link>

        <Link to="/print-ticket" style={linkStyle}>
          <FaClipboardList /> Print Ticket
        </Link>

        {/* ACCOUNT DROPDOWN */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              cursor: "pointer",
              background: "#e3f2fd",
              padding: "8px 14px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              color: "#0d47a1",
            }}
          >
            <FaUserCircle size={22} />
            {user ? `Hello, ${name?.split(" ")[0]}` : "Account"}
            <span style={{ fontSize: "12px" }}>▼</span>
          </div>

          {/* DROPDOWN */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "46px",
              background: "#fff",
              width: "220px",
              borderRadius: "10px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              overflow: "hidden",
              transform: open ? "scale(1)" : "scale(0.95)",
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {user ? (
              <>
                <div style={dropItem} onClick={() => navigate("/cancel-ticket")}>
                  Cancel Ticket
                </div>
                <div
                  style={dropItem}
                  onClick={() => navigate("/reschedule-ticket")}
                >
                  Reschedule Ticket
                </div>
                <div
                  style={{
                    ...dropItem,
                    color: "#d32f2f",
                    fontWeight: "700",
                  }}
                  onClick={logout}
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <div style={dropItem} onClick={() => navigate("/login")}>
                  Login
                </div>
                <div style={dropItem} onClick={() => navigate("/signup")}>
                  Signup
                </div>
                <div style={dropItem} onClick={() => navigate("/cancel-ticket")}>
                  Cancel Ticket
                </div>
                <div
                  style={dropItem}
                  onClick={() => navigate("/reschedule-ticket")}
                >
                  Reschedule Ticket
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* STYLES */
const navItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontSize: "18px",
  gap: "2px",
};

const navActive = ({ isActive }) => ({
  textDecoration: "none",
  fontWeight: "700",
  padding: "6px 14px",
  borderBottom: isActive ? "3px solid #1976d2" : "3px solid transparent",
  color: isActive ? "#1976d2" : "#1f2937",
  transition: "all 0.2s ease",
});

const dropItem = {
  padding: "12px 16px",
  cursor: "pointer",
  fontSize: "14px",
  borderBottom: "1px solid #f1f1f1",
  transition: "background 0.2s ease",
};

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: "600",
  color: "#1976d2",
  textDecoration: "none",
};
