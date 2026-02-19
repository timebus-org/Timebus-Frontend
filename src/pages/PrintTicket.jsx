import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PrintTicket.css";

export default function PrintTicket() {
  const [tin, setTin] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
const [refundAmount, setRefundAmount] = useState(0);

  const navigate = useNavigate();

  const fetchTicket = async () => {
    if (!tin.trim()) {
      setError("Please enter Ticket Number (TIN)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTicket(null);

      const res = await axios.get(
        `http://localhost:5000/api/ticket?tin=${tin.trim()}`
      );

      if (res.data.success) {
        setTicket(res.data.data); // IMPORTANT
      } else {
        setError("Ticket not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ticket not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="print-page">
      <div className="print-card">

        <div className="header-row">
          <h2>Print Ticket</h2>
          <button
            className="home-btn"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            value={tin}
            onChange={(e) => setTin(e.target.value)}
            placeholder="Enter Ticket Number (TIN)"
          />
          <button onClick={fetchTicket}>
            {loading ? "Searching..." : "Get Ticket"}
          </button>
        </div>

        {error && (
  <div className="error-box">
    {error}
  </div>
)}

{success && (
  <div className="success-box">
    <h3>Cancellation Successful</h3>
    <p>Refund Amount: ₹{refundAmount}</p>
    <p>Refund will be credited to original payment method.</p>
  </div>
)}


        {ticket && (
          <div id="print-area" className="ticket-wrapper">

            {/* HEADER */}
            <div className="ticket-header">
              <h2>TimeBus</h2>
              <p>Official E-Ticket</p>
            </div>

            {/* STATUS */}
            <div className={`status-badge ${ticket.status}`}>
              {ticket.status}
            </div>

            {/* BODY */}
            <div className="ticket-body">

              <div className="row">
                <span>TIN</span>
                <strong>{ticket.tin}</strong>
              </div>

              <div className="row">
                <span>Passengers</span>
                <strong>
                  {ticket.passengers?.map(p => p.name).join(", ")}
                </strong>
              </div>

              <div className="row">
                <span>Route</span>
                <strong>
                  {ticket.source} → {ticket.destination}
                </strong>
              </div>

              <div className="row">
                <span>Date of Journey</span>
                <strong>
                  {new Date(ticket.doj).toLocaleDateString("en-IN")}
                </strong>
              </div>

              <div className="row">
                <span>Seats</span>
                <strong>
                  {ticket.seats?.join(", ")}
                </strong>
              </div>

              <div className="row">
                <span>Payment ID</span>
                <strong>{ticket.paymentId}</strong>
              </div>

              <div className="total-row">
                <span>Status</span>
                <strong>{ticket.status}</strong>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="ticket-actions">
              <button
                className="print-btn"
                onClick={() => window.print()}
              >
                🖨 Print Ticket
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
