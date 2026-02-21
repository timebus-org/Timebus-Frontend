import { useNavigate } from "react-router-dom";
import "./Policy.css";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="policy-bg">
      <div className="policy-card">
        <h2>Privacy Policy</h2>
        <p><b>Effective Date:</b> 19 February 2026</p>

        <h3>1. Information We Collect</h3>
        <p>
          We may collect your name, email address, phone number, travel details,
          and booking information when you use our platform.
        </p>

        <h3>2. How We Use Your Information</h3>
        <p>
          Your information is used to process bookings, send confirmations,
          provide support, and improve our services.
        </p>

        <h3>3. Payment Processing</h3>
        <p>
          Payments are processed securely through third-party payment gateway
          providers. We do not store debit or credit card details on our servers.
        </p>

        <h3>4. Data Sharing</h3>
        <p>
          Booking details are shared with bus operators via authorized API
          integration for ticket confirmation and fulfillment.
        </p>

        <h3>5. Data Security</h3>
        <p>
          We implement reasonable security measures to protect user data from
          unauthorized access.
        </p>

        <h3>6. Contact Us</h3>
        <p>
          Email: timebus.in@gmail.com <br />
          Phone: +91-9790875433
        </p>

        <button onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}