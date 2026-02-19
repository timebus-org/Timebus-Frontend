import { useState, useEffect } from "react";
import axios from "axios";
import "./SeatLayoutModal.css"; // make sure you create CSS for full-screen modal

export default function SeatLayoutModal({ bus, from, to, date, onClose }) {
  const [seats, setSeats] = useState([]);
  const [boardingPoints, setBP] = useState([]);
  const [droppingPoints, setDP] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/trips/trip-details/${bus.id}`
        );

        setSeats(response.data?.seatLayout || []);
        setBP(response.data?.boardingPoints || []);
        setDP(response.data?.droppingPoints || []);
      } catch (err) {
        console.error("Seat fetch error:", err);
        setSeats([]);
        setBP([]);
        setDP([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [bus.id]);

  const toggleSeat = (seat) => {
    if (seat.booked) return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    return total + (seat?.price || 0);
  }, 0);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("seat-modal-overlay")) onClose();
  };

  return (
    <div className="seat-modal-overlay" onClick={handleOverlayClick}>
      <div className="seat-modal slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="bus-info">
          <h2>{bus.travels} ({bus.busType})</h2>
          <p>{from.name} → {to.name} | {date}</p>
          <p>Departure: {bus.departureTime} | Arrival: {bus.arrivalTime}</p>
        </div>

        {loading ? (
          <p>Loading seats...</p>
        ) : (
          <>
            <h3>Boarding Points</h3>
            <ul>
              {boardingPoints.map((bp) => (
                <li key={bp.id}>{bp.name} ({bp.time})</li>
              ))}
            </ul>

            <h3>Dropping Points</h3>
            <ul>
              {droppingPoints.map((dp) => (
                <li key={dp.id}>{dp.name} ({dp.time})</li>
              ))}
            </ul>

            <h3>Seats</h3>
            <div className="seats-grid">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.booked ? "booked" : selectedSeats.includes(seat.id) ? "selected" : ""}`}
                  onClick={() => toggleSeat(seat)}
                  title={`₹${seat.price} | ${seat.type}`}
                >
                  {seat.name || seat.id}
                </div>
              ))}
            </div>

            <div className="seat-summary">
              <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
              <p>Total Price: ₹{totalPrice}</p>
              <button
                className="book-btn"
                disabled={selectedSeats.length === 0}
              >
                Book Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
