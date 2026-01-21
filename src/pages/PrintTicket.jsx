import { useEffect, useState } from "react";
import axios from "axios";

export default function PrintTicket() {
  const [user, setUser] = useState(null);
  const [pnr, setPnr] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("bus_user");
    if (u) setUser(JSON.parse(u));
  }, []);
  const loginBtn = {
  padding: "10px 22px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "16px",
};

  const fetchTicket = async () => {
    if (!pnr) {
      setError("Please enter Ticket Number / PNR");
      return;
    }

    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/print/${pnr}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bus_token")}`,
          },
        }
      );

      setTicket(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Ticket not found or unauthorized"
      );
    } finally {
      setLoading(false);
    }
  };

  /* 🚫 NOT LOGGED IN */
  if (!user) {
    return (
      <div style={pageCenter}>
        <div style={loginBox}>
          <h2 style={{ marginBottom: 10 }}>Login Required</h2>
          <p>Please log in to continue and print your ticket.</p>
          <button
          onClick={() => window.location.href = "/login"}
          style={loginBtn}
        >
          Login Now
        </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Print Ticket</h2>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          placeholder="Enter Ticket Number / PNR"
          style={input}
        />
        <button onClick={fetchTicket} style={btn}>
          {loading ? "Searching..." : "Get Ticket"}
        </button>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      {/* 🎫 TICKET VIEW */}
      {ticket && (
        <div style={ticketBox} id="print-area">
          <h3 style={{ marginBottom: 10 }}>Timebus E-Ticket</h3>

          <div style={row}><b>PNR:</b> {ticket.pnr}</div>
          <div style={row}><b>Name:</b> {ticket.passengerName}</div>
          <div style={row}><b>Bus:</b> {ticket.busNumber}</div>
          <div style={row}><b>Route:</b> {ticket.from} → {ticket.to}</div>
          <div style={row}><b>Date:</b> {ticket.travelDate}</div>
          <div style={row}><b>Seats:</b> {ticket.seats.join(", ")}</div>
          <div style={row}><b>Total Paid:</b> ₹{ticket.totalAmount}</div>

          <button
            onClick={() => window.print()}
            style={{ ...btn, marginTop: 20 }}
          >
            Print Ticket
          </button>
        </div>
      )}
    </div>
  );
}

/* 🔹 STYLES */

const input = {
  flex: 1,
  padding: "12px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = {
  padding: "12px 20px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

const errorBox = {
  background: "#ffebee",
  padding: "10px",
  color: "#c62828",
  borderRadius: "6px",
  marginBottom: "20px",
};

const ticketBox = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  background: "#fff",
};

const row = {
  marginBottom: "8px",
};

const pageCenter = {
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loginBox = {
  padding: "30px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#fafafa",
  textAlign: "center",
};
