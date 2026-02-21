import { useNavigate } from "react-router-dom";
import "./Policy.css";

export default function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="policy-bg">
      <div className="policy-card">
        <h2>Terms & Conditions</h2>
        <p><b>Effective Date:</b> 19 February 2026</p>

        <h3>1. Role of Platform</h3>
        <p>
          TimeBus acts as an intermediary platform facilitating bus ticket
          bookings through third-party operators via API integration.
          We are not a bus operator.
        </p>

        <h3>2. Booking Confirmation</h3>
        <p>
          A booking is confirmed only after successful payment and operator confirmation.
        </p>

        <h3>3. Pricing & Fees</h3>
        <p>
          Ticket prices are determined by bus operators. A convenience or
          platform fee may be applied where applicable.
        </p>

        <h3>4. Cancellation & Refund</h3>
        <p>
          Cancellation and refund policies are governed by the respective
          bus operator and processed via API integration.
        </p>

        <h3>5. Limitation of Liability</h3>
        <p>
          TimeBus is not responsible for delays, service issues, or schedule
          changes caused by bus operators.
        </p>

        <h3>6. Contact</h3>
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