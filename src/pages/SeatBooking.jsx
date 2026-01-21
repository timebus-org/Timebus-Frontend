import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SeatSelection from "../components/SeatSelection";

export default function SeatBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/buses/${id}`)
      .then(res => setBus(res.data))
      .catch(() => alert("Failed to load bus details"));
  }, [id]);

  if (!bus) return <h2 style={{ textAlign: "center" }}>Loading seats...</h2>;

  const handleConfirm = (selectedSeats) => {
    if (selectedSeats.length === 0) {
      alert("Select at least one seat");
      return;
    }

    navigate("/payment", {
      state: {
        busId: bus._id,
        seats: selectedSeats,
        amount: selectedSeats.length * bus.fare
      }
    });
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        {bus.busName} ({bus.busType})
      </h2>

      <SeatSelection
        seats={bus.seats}
        fare={bus.fare}
        onConfirm={handleConfirm}
      />
    </>
  );
}
