import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingSuccess() {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const pnr = new URLSearchParams(window.location.search).get("pnr");

  useEffect(() => {
    if (!pnr) {
      setError("Invalid booking reference");
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/${pnr}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("bus_token")}`,
            },
          }
        );

        setTicket(res.data);

        // ✅ AUTO DOWNLOAD / PRINT
        setTimeout(() => {
          window.print();
        }, 1500);
      } catch (err) {
        setError("Unable to fetch booking details");
      }
    };

    fetchBooking();
  }, [pnr]);

  if (error) {
    return <div style={errorBox}>{error}</div>;
  }

  if (!ticket) {
    return <div style={loading}>Loading booking details...</div>;
  }

  return (
    <div style={page}>
      {/* SUCCESS TICK */}
      <div style={tickCircle}>
        <div style={tick}>✓</div>
      </div>

      <h1 style={title}>Booking Successful</h1>
      <p style={subtitle}>Your ticket has been booked successfully</p>

      {/* TICKET DETAILS */}
      <div style={card} id="print-area">
        <Detail label="PNR" value={ticket.pnr} />
        <Detail label="Passenger" value={ticket.passengerName} />
        <Detail label="Bus Number" value={ticket.busNumber} />
        <Detail label="Route" value={`${ticket.from} → ${ticket.to}`} />
        <Detail label="Journey Date" value={ticket.travelDate} />
        <Detail label="Seats" value={ticket.seats.join(", ")} />
        <Detail label="Total Paid" value={`₹${ticket.totalAmount}`} />
        <Detail label="Payment ID" value={ticket.paymentId} />
      </div>

      <button style={printBtn} onClick={() => window.print()}>
        Download Ticket
      </button>
    </div>
  );
}

/* ---------- COMPONENT ---------- */
const Detail = ({ label, value }) => (
  <div style={row}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

/* ---------- STYLES ---------- */

const page = {
  padding: "80px 20px",
  textAlign: "center",
  fontFamily: "Inter, system-ui",
};

const tickCircle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "#4caf50",
  margin: "0 auto 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "scaleIn 0.6s ease",
};

const tick = {
  fontSize: "50px",
  color: "#fff",
  fontWeight: "bold",
};

const title = {
  color: "#2e7d32",
  marginBottom: "5px",
};

const subtitle = {
  color: "#555",
  marginBottom: "30px",
};

const card = {
  maxWidth: "520px",
  margin: "0 auto 30px",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  textAlign: "left",
  background: "#fff",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  fontSize: "15px",
};

const printBtn = {
  padding: "12px 30px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};

const loading = {
  padding: "100px",
  textAlign: "center",
};

const errorBox = {
  padding: "100px",
  color: "red",
  textAlign: "center",
};

/* ---------- ANIMATION ---------- */
const style = document.createElement("style");
style.innerHTML = `
@keyframes scaleIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
@media print {
  body * {
    visibility: hidden;
  }
  #print-area, #print-area * {
    visibility: visible;
  }
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
`;
document.head.appendChild(style);
