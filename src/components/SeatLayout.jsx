import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SteeringIcon from "../assets/steering.jpg";

export default function SeatLayout({ bus }) {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  if (!bus || !bus.seats) return <div>No seat data</div>;

  const getSeatPrice = (seat) =>
    seat.price || (seat.type?.toLowerCase() === "sleeper" ? bus.fare + 200 : bus.fare);

  const toggleSeat = (seat) => {
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
      ? "#0ee31c"
      : "#eeeeee";

    return (
      <div
        key={seat.seatNumber}
        onClick={() => toggleSeat(seat)}
        title={`Seat ${seat.seatNumber} | ₹${getSeatPrice(seat)}`}
        style={{
          gridColumn: isSleeper ? "span 2" : "span 1",
          height: isSleeper ? 38 : 56,
          background: bgColor,
          borderRadius: isSleeper ? 10 : 12,
          border: "1px solid #999",
          cursor: isBooked ? "not-allowed" : "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: isSleeper ? "center" : "space-between",
          padding: isSleeper ? "6px 8px" : "6px",
          fontSize: 11,
          fontWeight: 600,
          userSelect: "none",
          boxShadow: isBooked ? "none" : "0 2px 6px rgba(0,0,0,0.15)",
          opacity: isBooked ? 0.6 : 1,
        }}
      >
        {!isSleeper && (
          <div
            style={{
              height: 14,
              borderRadius: "8px 8px 4px 4px",
              background: "rgba(0,0,0,0.12)",
            }}
          />
        )}

        <div style={{ textAlign: "center" }}>{seat.seatNumber}</div>

        <div
          style={{
            textAlign: "right",
            fontSize: 10,
            fontWeight: 700,
            color: "#2e7d32",
          }}
        >
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
    if (selected.length === 0) return;
    try {
      const res = await axios.post("http://localhost:5000/api/buses/lock-seat", {
        busNumber: bus.busNumber,
        seats: selected,
      });

      const selectedSeatDetails = bus.seats
        .filter((s) => selected.includes(s.seatNumber))
        .map((s) => ({ seatNumber: s.seatNumber, type: s.type, price: getSeatPrice(s) }));

      const totalPrice = selectedSeatDetails.reduce((sum, s) => sum + s.price, 0);

      const bookingData = {
        busId: bus._id,
        tripId: bus._id,
        busName: bus.busName,
        source: bus.from,
        destination: bus.to,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        boardingPoint: "Not specified",
        selectedSeats: selectedSeatDetails,
        totalPrice,
        lockUntil: res.data.lockUntil,
        createdAt: Date.now(),
      };

      localStorage.setItem("bookingSession", JSON.stringify(bookingData));
      navigate("/passenger-info", { state: bookingData });
    } catch {
      alert("Seat locking failed. Try again.");
    }
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: 16,
        border: "2px solid #ddd",
        borderRadius: 14,
        background: "#fafafa",
      }}
    >
      {/* BUS BODY */}
      <div
        style={{
          border: "2px solid #bbb",
          borderRadius: "30px",
          background: "#fff",
          padding: "20px 16px",
          position: "relative",
        }}
      >
        {/* DRIVER (FRONT LEFT) */}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 24,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid #555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
          }}
        >
          <img
            src={SteeringIcon}
            alt="Driver steering"
            style={{
              width: 20,
              height: 20,
              display: "block",
            }}
          />
        </div>

        {/* SEAT AREA */}
        <div style={{ paddingLeft: 90 }}>
          {seatsByDeck.map(({ deck, seatsByRow }) => (
            <div key={deck} style={{ marginBottom: 28 }}>
              <h4
                style={{
                  marginBottom: 10,
                  textTransform: "capitalize",
                  fontWeight: 700,
                }}
              >
                {deck} Deck
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {seatsByRow.map(({ row, seats }) => (
                  <div
                    key={row}
                    style={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "repeat(2,72px) 60px repeat(1,72px)",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {/* AISLE */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: 60,
                        transform: "translateX(-50%)",
                        background:
                          "repeating-linear-gradient(to bottom, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 12px)",
                        pointerEvents: "none",
                      }}
                    />

                    {seats.map(renderSeat)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div style={{ marginTop: 14, fontWeight: 600 }}>
        Selected Seats: {selected.join(", ") || "None"}
        <br />
        Total Price: ₹{total}
      </div>

      <button
        onClick={handleBookNow}
        disabled={selected.length === 0}
        style={{
          marginTop: 14,
          width: "100%",
          padding: "12px",
          background: selected.length === 0 ? "#aaa" : "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: selected.length === 0 ? "not-allowed" : "pointer",
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Book Now
      </button>
    </div>
  );
}
