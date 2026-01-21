import { useState } from "react";

export default function SeatSelection({ seats = [], fare = 100, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNo) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNo)
        ? prev.filter((s) => s !== seatNo)
        : [...prev, seatNo]
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 style={{ color: "#2563eb", marginBottom: 20 }}>Select Your Seats</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 60px)", gap: 15, justifyContent: "center" }}>
        {seats.map(({ seatNo, status }) => (
          <div
            key={seatNo}
            onClick={() => status === "available" && toggleSeat(seatNo)}
            style={{
              padding: 14,
              borderRadius: 10,
              textAlign: "center",
              fontWeight: 700,
              cursor: status === "available" ? "pointer" : "not-allowed",
              backgroundColor: selectedSeats.includes(seatNo)
                ? "#2563eb"
                : status === "booked"
                ? "#ef4444"
                : "#e2e8f0",
              color: selectedSeats.includes(seatNo) ? "#fff" : "#000"
            }}
          >
            {seatNo}
          </div>
        ))}
      </div>

      <button
        onClick={() => onConfirm(selectedSeats)}
        style={{
          marginTop: 30,
          width: "100%",
          background: "#2563eb",
          color: "#fff",
          padding: 15,
          borderRadius: 10,
          border: "none",
          fontSize: 18
        }}
      >
        Confirm Booking ₹{fare * selectedSeats.length}
      </button>
    </div>
  );
}
