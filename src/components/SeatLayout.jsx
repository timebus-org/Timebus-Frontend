import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SteeringIcon from "../assets/steering.jpg";

export default function SeatLayout({ bus }) {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!bus || !bus.seats || bus.seats.length === 0) {
    return <div>No seat data available</div>;
  }

  const getSeatPrice = (seat) =>
    seat.price != null
      ? seat.price
      : seat.type?.toLowerCase() === "sleeper"
      ? bus.fare + 200
      : bus.fare;

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatNumber === seat.seatNumber);
      return exists
        ? prev.filter((s) => s.seatNumber !== seat.seatNumber)
        : [...prev, seat];
    });
  };

  /* ================= BOOK NOW ================= */
  const handleBookNow = async () => {
    if (selectedSeats.length === 0) {
      alert("No seats selected!");
      return;
    }

    setLoading(true);

    try {
      const seatsToLock = selectedSeats.map((s) => s.seatNumber);

      await axios.post("http://localhost:5000/api/buses/lock-seat", {
        busNumber: bus.busNumber,
        seats: seatsToLock,
      });

      const selectedSeatDetails = selectedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        type: s.type,
        price: getSeatPrice(s),
      }));

      const totalPrice = selectedSeatDetails.reduce(
        (sum, s) => sum + s.price,
        0
      );

      navigate("/passenger-info", {
        state: {
          busId: bus._id,
          tripId: bus.tripId,
          busName: bus.busName,
          busType: bus.busType,
          source: bus.from,
          destination: bus.to,
          journeyDate: bus.journeyDate,
          boardingPoint: bus.boardingPoints?.[0],
          droppingPoint: bus.droppingPoints?.[0],
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          duration: bus.duration,
          selectedSeats: selectedSeatDetails,
          totalPrice,
        },
      });
    } catch (err) {
      alert("Seat locking failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER SEAT ================= */
  const renderSeat = (seat) => {
    const isSelected = selectedSeats.some(
      (s) => s.seatNumber === seat.seatNumber
    );

    const bg =
      seat.status === "booked"
        ? "#c62828"
        : isSelected
        ? "#2e7d32"
        : "#eee";

    return (
      <div
        key={seat.seatNumber}
        onClick={() => toggleSeat(seat)}
        style={{
          width: 60,
          height: 60,
          background: bg,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          cursor: seat.status === "available" ? "pointer" : "not-allowed",
          fontWeight: 700,
          fontSize: 12,
          color: seat.status === "booked" ? "#fff" : "#000",
          boxShadow: isSelected ? "0 0 10px rgba(46,125,50,0.6)" : "0 2px 5px rgba(0,0,0,0.15)",
          transition: "0.2s",
        }}
        title={`Seat ${seat.seatNumber} | ₹${getSeatPrice(seat)}`}
      >
        {seat.seatNumber}
        <small style={{ fontSize: 10 }}>₹{getSeatPrice(seat)}</small>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 520, margin: "auto", padding: 16 }}>
      {/* LEGEND */}
      <div style={{ display: "flex", gap: 20, marginBottom: 16, fontSize: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, background: "#eee", border: "1px solid #999", borderRadius: 4 }} />
          Available
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, background: "#2e7d32", borderRadius: 4 }} />
          Selected
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, background: "#c62828", borderRadius: 4 }} />
          Booked
        </div>
      </div>

      <div style={{ padding: 20, border: "2px solid #ccc", borderRadius: 12, background: "#fff", position: "relative" }}>
        <img src={SteeringIcon} alt="" width={30} style={{ position: "absolute", left: 20, top: 20 }} />

        <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {bus.seats.map(renderSeat)}
        </div>
      </div>

      <div style={{ marginTop: 12, fontWeight: 600, background: "#fafafa", padding: 10, borderRadius: 6 }}>
        Selected Seats: {selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}
        <br />
        Total: ₹{selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0)}
      </div>

      <button
        onClick={handleBookNow}
        disabled={loading || selectedSeats.length === 0}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 12,
          background: loading || selectedSeats.length === 0 ? "#aaa" : "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 700,
          cursor: loading || selectedSeats.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Locking..." : "Book Now"}
      </button>
    </div>
  );
}
