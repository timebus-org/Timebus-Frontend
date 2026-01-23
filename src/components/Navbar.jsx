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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
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

  // Section-based active tabs
  const busPages = ["/", "/bus-tickets", "/bus-search", "/booking-summary", "/cancel-ticket", "/reschedule-ticket"];
  const cabPages = ["/CarBooking", "/cab-search", "/cab-summary", "/cab-cancel", "/cab-reschedule"];
  const isBusActive = busPages.includes(location.pathname);
  const isCabActive = cabPages.includes(location.pathname);

  return (
    <>
      {/* ===== Navbar Top ===== */}
      <nav className="navBar">
        <div className="leftWrap">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* Desktop + Mobile Top Tabs */}
          <div className="tabGroup">
            <NavLink to="/bus-tickets" className={`tabItem ${isBusActive ? "active" : ""}`}>
              <img src={busIcon} alt="Bus" className="tabIcon" />
              <span>Bus</span>
              <span className="underline" />
            </NavLink>
            <NavLink to="/CarBooking" className={`tabItem ${isCabActive ? "active" : ""}`}>
              <img src={cbIcon} alt="Cab" className="tabIcon" />
              <span>Cabs</span>
              <span className="underline" />
            </NavLink>
          </div>
        </div>

        <div className="rightWrap">
          <Link to="/contact-us" className="topLink">
            <FaPhoneAlt /> <span className="hide-sm">Help</span>
          </Link>
          <Link to="/print-ticket" className="topLink">
            <FaClipboardList /> <span className="hide-sm">Print Ticket</span>
          </Link>

          <div ref={dropdownRef} className="accountWrapper">
            <div onClick={() => setOpen(!open)} className="accountBtn">
              <FaUserCircle size={20} />
              <span className="hide-sm">{registeredName ? `Hello, ${registeredName}` : "Account"}</span>
              <span style={{ marginLeft: 4 }}>▼</span>
            </div>
            <div className={`dropdown ${open ? "open" : ""}`}>
              {user ? (
                <>
                  <div className="dropItem" onClick={() => { setOpen(false); navigate("/cancel-ticket"); }}>Cancel Ticket</div>
                  <div className="dropItem" onClick={() => { setOpen(false); navigate("/reschedule-ticket"); }}>Reschedule Ticket</div>
                  <div className="dropItem logout" onClick={logout}>Logout</div>
                </>
              ) : (
                <>
                  <div className="dropItem" onClick={() => { setOpen(false); navigate("/login"); }}>Login</div>
                  <div className="dropItem" onClick={() => { setOpen(false); navigate("/signup"); }}>Signup</div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Bottom Fixed Tabs (optional) ===== */}
      <div className="mobileTabs">
        <NavLink to="/bus-tickets" className={`mobileTab ${isBusActive ? "active" : ""}`}>
          <img src={busIcon} alt="Bus" className="tabIcon" />
          <span>Bus</span>
          <span className="underline" />
        </NavLink>
        <NavLink to="/CarBooking" className={`mobileTab ${isCabActive ? "active" : ""}`}>
          <img src={cbIcon} alt="Cab" className="tabIcon" />
          <span>Cabs</span>
          <span className="underline" />
        </NavLink>
      </div>

      <style>{`
.navBar { position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; height: 74px; background: #fff; border-bottom: 1px solid #e6eaf0; font-family: Inter, system-ui, sans-serif; box-shadow: 0 3px 8px rgba(0,0,0,0.05); }
.logo { height: 46px; }
.leftWrap { display: flex; align-items: center; gap: 50px; }
.tabGroup { display: flex; gap: 45px; align-items: flex-end; height: 100%; }
.tabItem { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; font-size: 16px; font-weight: 700; position: relative; text-decoration: none; color: #1f2937; transition: all 0.25s ease; }
.tabItem.active { color: #1976d2; }
.tabItem .underline { position: absolute; bottom: 0; height: 3px; width: 100%; background: #1976d2; border-radius: 3px; transform: scaleX(0); transition: transform 0.25s ease; }
.tabItem.active .underline { transform: scaleX(1); }
.tabIcon { width: 22px; height: 22px; }

.rightWrap { display: flex; align-items: center; gap: 22px; position: relative; }
.topLink { text-decoration: none; display: flex; align-items: center; gap: 4px; color: #1f2937; font-weight: 500; transition: all 0.2s ease; }
.topLink:hover { color: #1976d2; }
.accountWrapper { position: relative; }
.accountBtn { cursor: pointer; background: #e3f2fd; padding: 6px 12px; border-radius: 6px; display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 15px; color: #0d47a1; transition: all 0.2s ease; }
.accountBtn:hover { background: #bbdefb; }
.dropdown { position: absolute; right: 0; top: 44px; width: 220px; background: #fff; border-radius: 10px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); transform: scale(0.95); opacity: 0; pointer-events: none; transition: all 0.2s ease; }
.dropdown.open { transform: scale(1); opacity: 1; pointer-events: auto; }
.dropItem { padding: 12px 16px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #f1f1f1; transition: background 0.15s ease; }
.dropItem:hover { background: #f5f5f5; }
.dropItem.logout { color: #d32f2f; font-weight: 700; }

/* Mobile Bottom Tabs */
/* Mobile Bottom Tabs */
.mobileTabs {
  display: none; /* hide by default (desktop) */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #e6eaf0;
  justify-content: space-around;
  padding: 6px 0;
  box-shadow: 0 -3px 10px rgba(0,0,0,0.08);
  z-index: 101;
}

@media (max-width: 600px) {
  .mobileTabs {
    display: flex; /* show only on mobile */
  }
}

.mobileTab { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #6b7280; font-weight: 600; position: relative; text-decoration: none; transition: all 0.25s ease; }
.mobileTab.active { color: #1976d2; }
.mobileTab .underline { position: absolute; bottom: 0; height: 3px; width: 100%; background: #1976d2; border-radius: 3px; transform: scaleX(0); transition: transform 0.25s ease; }
.mobileTab.active .underline { transform: scaleX(1); }

/* ---------- Responsive ---------- */
@media (max-width: 600px) {
  .hide-sm { display: none; }
  .topLink { display: none; }
  .mobileTabs { display: flex; } /* Show fixed bottom tabs on mobile */
  .navBar { padding: 0 14px; height: 60px; }
  .logo { height: 40px; }
}
      `}</style>
    </>
  );
}
