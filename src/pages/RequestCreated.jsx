import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestCreated.css";

export default function RequestCreated() {
  const navigate = useNavigate();

  // Redirect to home automatically after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // go back to home page
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="request-created-bg">
      <div className="request-created-container">
        <h2>✅ Your Booking Request Has Been Sent!</h2>
        <p>
          The cab owner has been notified. They will contact you soon to confirm the details.
        </p>

        <div className="actions">
          <button onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>

        <p className="note">
          * You will be redirected to the home page automatically in 5 seconds.
        </p>
      </div>
    </div>
  );
}
