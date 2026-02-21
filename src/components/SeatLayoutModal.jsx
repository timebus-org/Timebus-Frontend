import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeatLayoutModal.css";
const API = import.meta.env.VITE_API_URL;
export default function SeatLayoutPro({ bus, from, to, date, onClose }) {
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [boardingPoints, setBP] = useState([]);
  const [droppingPoints, setDP] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBP, setSelectedBP] = useState(null);
  const [selectedDP, setSelectedDP] = useState(null);
  const [step, setStep] = useState(1);
  const [gstPercent, setGstPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bus?.id) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let isMounted = true;

    const fetchTripDetails = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/api/trips/trip-details/${bus.id}`
        );

        if (!isMounted) return;

        const data = res?.data || {};

        const mappedSeats = (data.seats || []).map((s) => ({
          id: `${s.column}-${s.row}-${s.name}`,
          seatNumber: s.name,
          price: parseFloat(s.fare || s.baseFare || 0),
          booked: s.available === "false" || s.available === false,
          ladies: s.ladiesSeat === "true",
          row: Number(s.row),
          column: Number(s.column),
          zIndex: Number(s.zIndex || 0),
          length: Number(s.length || 1),
          width: Number(s.width || 1),
        }));

        setSeats(mappedSeats);
        setBP(Array.isArray(data.boardingTimes) ? data.boardingTimes : []);
        setDP(Array.isArray(data.droppingTimes) ? data.droppingTimes : []);
        setGstPercent(Number(data.gst || 5));
      } catch (err) {
        console.error("Failed to load trip details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTripDetails();

    return () => {
      isMounted = false;
      document.body.style.overflow = originalOverflow;
    };
  }, [bus?.id]);

  const layout = useMemo(() => {
    const grid = {};
    seats.forEach((seat) => {
      if (!grid[seat.zIndex]) grid[seat.zIndex] = true;
    });
    return grid;
  }, [seats]);

  const toggleSeat = (seat) => {
    if (!seat || seat.booked) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      return exists
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat];
    });
  };

  const seatTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const gstAmount = ((seatTotal * gstPercent) / 100).toFixed(2);
  const grandTotal = (seatTotal + parseFloat(gstAmount)).toFixed(2);

  const isBoardingRequired = boardingPoints.length > 0;
  const isDroppingRequired = droppingPoints.length > 0;

  const canContinue =
    selectedSeats.length > 0 &&
    (!isBoardingRequired || selectedBP) &&
    (!isDroppingRequired || selectedDP);

  const handleContinue = () => {
    if (!selectedSeats.length) return alert("Please select seat");
    if (boardingPoints.length > 0 && !selectedBP)
      return alert("Please select boarding point");
    if (droppingPoints.length > 0 && !selectedDP)
      return alert("Please select dropping point");

    navigate("/passenger-info", {
      state: {
        tripData: {
          availableTripId: bus.id,
          source: bus.source,
          destination: bus.destination,
          travels: bus.travels,
        },
        bus,
        from,
        to,
        date,
        selectedSeats: selectedSeats.map((s) => ({
          seatName: s.seatNumber,
          fare: s.price,
        })),
        boardingPoint: selectedBP,
        droppingPoint: selectedDP,
        seatFare: seatTotal,
        gst: gstAmount,
        totalPrice: grandTotal,
      },
    });
  };

  if (loading) return <div className="seat-modal-pro">Loading...</div>;

  const maxColumn = Math.max(...seats.map((s) => s.column), 0);
  const maxRow = Math.max(...seats.map((s) => s.row), 0);

  return (
    <div className="seat-modal-pro">
      <div className="seat-modal-header">
        <div>
          <h2>{bus?.travels}</h2>
          <p>
            {from?.name} → {to?.name} | {date}
          </p>
        </div>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="seat-modal-body">
        {step === 1 && (
          <div className="main-layout">
            <div className="seat-section">
              <div className="deck-grid-layout">
                {Object.keys(layout)
                  .sort((a, b) => a - b)
                  .map((z) => (
                    <div key={z} className="deck-box">
                      <div className="deck-header">
                        <span className="deck-title">
                          {z === "0" ? "Lower Deck" : "Upper Deck"}
                        </span>
                        <div className="deck-right">
                          <span className="front-label">FRONT →</span>
                          <span className="driver-icon">🧑‍✈️</span>
                        </div>
                      </div>

                      <div className="seat-legend">
                        <div><span className="legend-box available" /> Available</div>
                        <div><span className="legend-box selected" /> Selected</div>
                        <div><span className="legend-box booked" /> Booked</div>
                        <div><span className="legend-box ladies" /> Ladies</div>
                      </div>

                      <div className="deck-canvas">
                        <div className="window-line left" />
                        <div className="window-line right" />
                        <div className="aisle-highlight" />

                        {seats
                          .filter((s) => s.zIndex == z)
                          .map((seat) => (
                            <div
                              key={seat.id}
                              className={`seat-pro
                                ${seat.booked ? "booked" : ""}
                                ${seat.ladies ? "ladies" : ""}
                                ${seat.length > 1 || seat.width > 1 ? "sleeper" : ""}
                                ${
                                  selectedSeats.some((s) => s.id === seat.id)
                                    ? "selected"
                                    : ""
                                }`}
                              style={{
                                left: `${((seat.column + 1.2) / (maxColumn + 3.5)) * 100}%`,
top: `${((seat.row + 1.2) / (maxRow + 3.5)) * 100}%`,
transform: "translate(-50%, -50%)",

                                
                                
                              }}
                              onClick={() => toggleSeat(seat)}
                            >
                              {seat.seatNumber}
                              <small>₹{seat.price}</small>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="summary-section">
              <h3>Booking Summary</h3>
              <p>
                <strong>Selected Seats:</strong><br />
                {selectedSeats.length
                  ? selectedSeats.map((s) => s.seatNumber).join(", ")
                  : "None"}
              </p>
              <hr />
              <p>Seat Fare: ₹{seatTotal}</p>
              <p>GST ({gstPercent}%): ₹{gstAmount}</p>
              <h2>Total: ₹{grandTotal}</h2>
              <button
                className="continue-btn"
                disabled={!selectedSeats.length}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 remains EXACTLY same as yours */}
        {step === 2 && (
          <div className="points-container">
            <div className="points-block">
              <h3>Boarding Point</h3>
              <div className="points-list">
                {boardingPoints.length === 0 && (
                  <p>No boarding points required</p>
                )}
                {boardingPoints.map((bp) => (
                  <div
                    key={bp.bpId}
                    className={`point-item ${
                      selectedBP?.bpId === bp.bpId ? "active" : ""
                    }`}
                    onClick={() => setSelectedBP(bp)}
                  >
                    <span className="bullet" />
                    <div>
                      <strong>{bp.bpName}</strong>
                      {bp.bpTime && <small>{bp.bpTime}</small>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="points-block">
              <h3>Dropping Point</h3>
              <div className="points-list">
                {droppingPoints.length === 0 && (
                  <p>No dropping points required</p>
                )}
                {droppingPoints.map((dp) => (
                  <div
                    key={dp.bpId}
                    className={`point-item ${
                      selectedDP?.bpId === dp.bpId ? "active" : ""
                    }`}
                    onClick={() => setSelectedDP(dp)}
                  >
                    <span className="bullet" />
                    <div>
                      <strong>{dp.bpName}</strong>
                      {dp.bpTime && <small>{dp.bpTime}</small>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="points-footer">
              <button onClick={() => setStep(1)}>
                ← Back to Seat Selection
              </button>
              <button
                className="continue-btn"
                disabled={!canContinue}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

