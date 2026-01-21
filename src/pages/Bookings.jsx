import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("bus_user"));
    if (!user) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/my-tickets", {
      headers: { Authorization: `Bearer ${localStorage.getItem("bus_token")}` },
    })
      .then(res => res.json())
      .then(setTickets);
  }, []);

  return (
    <div style={wrap}>
      <h2>My Bookings</h2>

      {tickets.length === 0 && <p>No bookings found</p>}

      {tickets.map(t => (
        <div key={t.id} style={card}>
          <p><b>PNR:</b> {t.id}</p>
          <p><b>Bus:</b> {t.busNumber}</p>
          <p><b>Seat:</b> {t.seatNumber}</p>
          <p><b>Date:</b> {t.journeyDate}</p>
          <p><b>Status:</b> {t.status}</p>

          {t.status === "CONFIRMED" && (
            <div>
              <button onClick={() => navigate(`/cancel-ticket/${t.id}`)}>
                Cancel
              </button>
              <button onClick={() => navigate(`/reschedule-ticket/${t.id}`)}>
                Reschedule
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const wrap = { padding: "24px" };
const card = {
  background: "#fff",
  padding: "16px",
  marginBottom: "12px",
  borderRadius: "8px",
};
