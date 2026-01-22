import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaClipboardList,
  FaBars,
} from "react-icons/fa";
import { supabase } from "../supabaseClient";

import logo from "../assets/logo.png";
import busIcon from "../assets/bus.png";
import cbIcon from "../assets/cab.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  /* ================= AUTH ================= */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setUser(session?.user ?? null);
        setOpen(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClick = (e) => {
      if (
        desktopDropdownRef.current?.contains(e.target) ||
        mobileDropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  /* ================= HELPERS ================= */

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const registeredName = user?.user_metadata?.full_name;

  const isBusActive =
    location.pathname === "/" || location.pathname === "/bus-tickets";

  const tabActive = ({ isActive }) => ({
    textDecoration: "none",
    color:
      isBusActive && isActive
        ? "#1976d2"
        : isActive
        ? "#1976d2"
        : "#1f2937",
    borderBottom: isActive
      ? "3px solid #1976d2"
      : "3px solid transparent",
    paddingBottom: "6px",
  });

  /* ================= RENDER ================= */

  return (
    <>
      <nav style={navBar}>
        {/* LEFT */}
        <div style={leftWrap}>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: 46 }} />
          </Link>

          <div style={tabGroup}>
            <NavLink to="/bus-tickets" style={tabActive}>
              <div style={tabItem}>
                <img src={busIcon} style={tabIcon} alt="Bus" />
                <span>Bus</span>
              </div>
            </NavLink>

            <NavLink to="/CarBooking" style={tabActive}>
              <div style={tabItem}>
                <img src={cbIcon} style={tabIcon} alt="Cabs" />
                <span>Cabs</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* DESKTOP RIGHT */}
        <div style={rightWrap} className="desktop-only">
          <Link to="/contact-us" style={rightLink}>
            <FaPhoneAlt /> Help
          </Link>

          <Link to="/print-ticket" style={rightLink}>
            <FaClipboardList /> Print Ticket
          </Link>

          <div ref={desktopDropdownRef} style={{ position: "relative" }}>
            <div style={accountBtn} onClick={() => setOpen((o) => !o)}>
              <FaUserCircle size={20} />
              {registeredName || "Account"} ▼
            </div>

            {open && (
              <div style={dropdown}>
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
                    <div style={{ ...dropItem, color: "#d32f2f" }} onClick={logout}>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE */}
        <div ref={mobileDropdownRef} className="mobile-only">
          <FaBars size={22} onClick={() => setOpen((o) => !o)} />

          {open && (
            <div style={dropdown}>
              <div style={dropItem} onClick={() => navigate("/contact-us")}>
                <FaPhoneAlt /> Help
              </div>
              <div style={dropItem} onClick={() => navigate("/print-ticket")}>
                <FaClipboardList /> Print Ticket
              </div>

              {user ? (
                <div style={{ ...dropItem, color: "#d32f2f" }} onClick={logout}>
                  Logout
                </div>
              ) : (
                <>
                  <div style={dropItem} onClick={() => navigate("/login")}>
                    Login
                  </div>
                  <div style={dropItem} onClick={() => navigate("/signup")}>
                    Signup
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @media (max-width: 600px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
        }
        .mobile-only { display: none; cursor: pointer; }
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
  alignItems: "center",
  borderBottom: "1px solid #e6eaf0",
  position: "sticky",
  top: 0,
  zIndex: 9999,
};

const leftWrap = {
  display: "flex",
  alignItems: "center",
  gap: "50px",
};

const tabGroup = {
  display: "flex",
  gap: "45px",
};

const tabItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  fontWeight: 700,
   transform: "translateY(8px)",
};

const tabText = {
  marginTop: "10px",   // 👈 pushes text down
};

const tabIcon = {
  width: "22px",
  height: "22px",
};

const rightWrap = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
};

const rightLink = {
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "4px",
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
};

const dropdown = {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: "8px",
  width: "220px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  overflow: "hidden",
};

const dropItem = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f1f1",
};
