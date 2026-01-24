import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SteeringIcon from "../assets/steering.jpg";

export default function SeatLayout({ bus }) {
  const [selected, setSelected] = useState([]);
  const [locking, setLocking] = useState(false);
  const navigate = useNavigate();

  if (!bus || !bus.seats) return <div>No seat data</div>;

  const getSeatPrice = (seat) =>
    seat.price || (seat.type?.toLowerCase() === "sleeper" ? bus.fare + 200 : bus.fare);

  const toggleSeat = (seat) => {
    if (locking) return;
    if (seat.status === "booked" || seat.status === "waiting") return;

    setSelected((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

  const decks = [...new Set(bus.seats.map((s) => s.deck || "lower"))];

  const seatsByDeck = decks.map((deck) => {
    const seatsInDeck = bus.seats.filter((s) => (s.deck || "lower") === deck);
    const rows = [...new Set(seatsInDeck.map((s) => s.row))].sort((a, b) => a - b);
    const seatsByRow = rows.map((row) => ({
      row,
      seats: seatsInDeck
        .filter((s) => s.row === row)
        .sort((a, b) => a.col - b.col),
    }));
    return { deck, seatsByRow };
  });

  const renderSeat = (seat) => {
    const isSelected = selected.includes(seat.seatNumber);
    const isBooked = seat.status === "booked";
    const isWaiting = seat.status === "waiting";
    const isSleeper = seat.type?.toLowerCase() === "sleeper";

    const bgColor = isBooked
      ? "#c62828"
      : isWaiting
      ? "#f9a825"
      : isSelected
      ? "#1db954"
      : "#eeeeee";

    return (
      <div
        key={seat.seatNumber}
        onPointerDown={(e) => {
          e.preventDefault();
          toggleSeat(seat);
        }}
        title={`Seat ${seat.seatNumber} | ₹${getSeatPrice(seat)}`}
        style={{
          gridColumn: isSleeper ? "span 2" : "span 1",
          height: isSleeper ? 32 : 44,
          background: bgColor,
          borderRadius: isSleeper ? 8 : 10,
          border: "1px solid #999",
          cursor: isBooked || locking ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 4,
          fontSize: 10,
          fontWeight: 700,
          userSelect: "none",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          opacity: isBooked ? 0.6 : 1,
          touchAction: "manipulation",
          pointerEvents: locking ? "none" : "auto",
        }}
      >
        <div style={{ textAlign: "center" }}>{seat.seatNumber}</div>
        <div style={{ fontSize: 9, textAlign: "center", color: "#2e7d32" }}>
          ₹{getSeatPrice(seat)}
        </div>
      </div>
    );
  };

  const total = selected.reduce((sum, seatNo) => {
    const seat = bus.seats.find((s) => s.seatNumber === seatNo);
    return sum + (seat ? getSeatPrice(seat) : 0);
  }, 0);

  async function handleBookNow() {
    if (selected.length === 0 || locking) return;

    try {
      setLocking(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/buses/lock-seat`,
        {
          busNumber: bus.busNumber,
          seats: selected,
        }
      );

      const selectedSeatDetails = bus.seats
        .filter((s) => selected.includes(s.seatNumber))
        .map((s) => ({
          seatNumber: s.seatNumber,
          type: s.type,
          price: getSeatPrice(s),
        }));

      const totalPrice = selectedSeatDetails.reduce((sum, s) => sum + s.price, 0);

      const bookingData = {
        busId: bus._id,
        tripId: bus._id,
        busName: bus.busName,
        source: bus.from,
        destination: bus.to,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        selectedSeats: selectedSeatDetails,
        totalPrice,
        lockUntil: res.data.lockUntil,
        createdAt: Date.now(),
      };

      localStorage.setItem("bookingSession", JSON.stringify(bookingData));
      navigate("/passenger-info", { state: bookingData });
    } catch (err) {
      alert("Seat locking failed. Please try again.");
    } finally {
      setLocking(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 12 }}>
      <div
        style={{
          border: "2px solid #ccc",
          borderRadius: 20,
          background: "#fff",
          padding: 16,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 12, top: 16 }}>
          <img src={SteeringIcon} alt="Driver" width={20} />
        </div>

        <div style={{ paddingLeft: 60 }}>
          {seatsByDeck.map(({ deck, seatsByRow }) => (
            <div key={deck} style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8 }}>{deck} Deck</h4>

              {seatsByRow.map(({ row, seats }) => (
                <div
                  key={row}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 56px) 32px repeat(1, 56px)",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  {seats.map(renderSeat)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, fontWeight: 600 }}>
        Seats: {selected.join(", ") || "None"} <br />
        Total: ₹{total}
      </div>

      <button
        onClick={handleBookNow}
        disabled={selected.length === 0 || locking}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 12,
          background: locking ? "#999" : "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {locking ? "Locking Seats..." : "Book Now"}
      </button>
    </div>
  );
}
