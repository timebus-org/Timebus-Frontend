import { useState } from "react";

export default function RescheduleTicket() {
  const [ticketId, setTicketId] = useState("");
  const [newSeat, setNewSeat] = useState("");
  const [newDate, setNewDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const rescheduleTicket = async () => {
    if (!ticketId || !newSeat || !newDate) {
      return alert("All fields required");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/reschedule-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          newSeatNumber: newSeat,
          newJourneyDate: newDate,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2>Reschedule Ticket</h2>

        <input
          style={inp}
          placeholder="Ticket ID / PNR"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />

        <input
          style={inp}
          placeholder="New Seat Number"
          value={newSeat}
          onChange={(e) => setNewSeat(e.target.value)}
        />

        <input
          type="date"
          style={inp}
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />

        <button style={btn} onClick={rescheduleTicket}>
          {loading ? "Rescheduling..." : "Reschedule"}
        </button>

        {result && <p style={msg}>{result.message}</p>}
      </div>
    </div>
  );
}

/* ===== styles ===== */
const wrap = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#eef3ff",
};

const card = {
  width: "420px",
  padding: "24px",
  background: "#fff",
  borderRadius: "12px",
};

const inp = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
};

const msg = { marginTop: "12px" };
