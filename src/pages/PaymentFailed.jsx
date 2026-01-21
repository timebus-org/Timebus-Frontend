import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="failed">
      ❌
      <h2>Payment Failed</h2>
      <p>Seat lock is still active.</p>

      <button onClick={() => navigate("/payment")}>
        Retry Payment
      </button>
    </div>
  );
}
