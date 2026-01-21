import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer style={{ background: "#f8fafc", marginTop: "80px", fontFamily: "Inter, system-ui" }}>
      
      {/* APP PROMO */}
      <div style={appCard}>
        <div>
          <h2 style={{ color: "#0d47a1", marginBottom: "6px" }}>
            Download the Timebus App
          </h2>
          <p style={{ color: "#4b5563", fontSize: "14.5px" }}>
            App coming soon • Exclusive offers • Live booking updates
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              height="44"
            />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              height="44"
            />
          </a>
        </div>
      </div>

      {/* FOOTER GRID */}
      <div style={footerGrid}>
        
        {/* ABOUT */}
        <div>
          <h4 style={title}>About Timebus</h4>
          <p style={text}>
            Timebus is a next-generation bus booking platform connecting travelers
            with verified operators for safe, reliable, and seamless journeys.
          </p>
        </div>

        {/* ROUTES */}
        <div>
          <h4 style={title}>Top Routes</h4>
          <ul style={list}>
            <li><Link to="/bus-tickets?from=Hyderabad&to=Bangalore">Hyderabad – Bangalore</Link></li>
            <li><Link to="/bus-tickets?from=Mumbai&to=Pune">Mumbai – Pune</Link></li>
            <li><Link to="/bus-tickets?from=Delhi&to=Jaipur">Delhi – Jaipur</Link></li>
            <li><Link to="/bus-tickets?from=Chennai&to=Coimbatore">Chennai – Coimbatore</Link></li>
          </ul>
        </div>

        {/* OPERATORS */}
        <div>
          <h4 style={title}>For Operators</h4>
          <ul style={list}>
            <li><Link to="/partner-with-us">Partner with Us</Link></li>
            <li><Link to="/operator-login">Operator Login</Link></li>
            <li><Link to="/fleet-solutions">Fleet Solutions</Link></li>
            <li><Link to="/support">Support Center</Link></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h4 style={title}>Connect With Us</h4>

          <div style={socialRow}>
            <SocialIcon link="https://facebook.com/timebus" icon={<FaFacebookF />} />
            <SocialIcon link="https://instagram.com/timebus" icon={<FaInstagram />} />
            <SocialIcon link="https://twitter.com/timebus" icon={<FaXTwitter />} />
            <SocialIcon link="https://linkedin.com/company/timebus" icon={<FaLinkedinIn />} />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={bottomBar}>
        © 2025 Timebus Technologies Pvt. Ltd. •
        <Link to="/privacy"> Privacy </Link>•
        <Link to="/terms"> Terms </Link>•
        <Link to="/contact-us"> Customer Support</Link>
      </div>
    </footer>
  );
}

/* 🔧 SMALL COMPONENT */
const SocialIcon = ({ icon, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: "#e3f2fd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#0d47a1",
      cursor: "pointer",
      fontSize: "16px",
      transition: "0.2s",
      textDecoration: "none"
    }}
  >
    {icon}
  </a>
);

/* 🎨 STYLES */
const appCard = {
  background: "#ffffff",
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "30px 36px",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  transform: "translateY(-50px)"
};

const footerGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "30px 20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "30px"
};

const title = {
  fontSize: "15px",
  fontWeight: "600",
  marginBottom: "12px",
  color: "#0d47a1"
};

const text = {
  fontSize: "14px",
  color: "#4b5563",
  lineHeight: "1.7"
};

const list = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  fontSize: "14px",
  color: "#374151",
  lineHeight: "2"
};

const socialRow = {
  display: "flex",
  gap: "14px",
  marginTop: "10px"
};

const bottomBar = {
  borderTop: "1px solid #e5e7eb",
  padding: "16px",
  textAlign: "center",
  fontSize: "13px",
  color: "#6b7280",
  background: "#ffffff"
};
