import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BusView() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bus/search?id="+id)
      .then(res => setBus(res.data[0]));
  }, []);

  const toggleSeat = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const book = async () => {
    if (!localStorage.getItem("token")) return alert("Login first");

    await axios.post("http://localhost:5000/api/bus/book", {
      busId: bus._id,
      userId: "USER_ID_TEMP",  // later auto from auth
      seats: selectedSeats
    });

    alert("🎉 Booking Confirmed");
    window.location.href = "/ticket";
  };

  if (!bus) return <p>Loading...</p>;

  return (
    <div style={{padding:30}}>
      <h2>{bus.name} — {bus.from} → {bus.to}</h2>
      <p>₹{bus.price} per seat</p>

      <div style={grid}>
        {Array.from({ length: bus.seats }, (_,i)=>
          <div
            key={i+1}
            onClick={() => toggleSeat(i+1)}
            style={{
              ...seat,
              background: selectedSeats.includes(i+1) ? "#2563eb" : "#e2e8f0"
            }}>
            {i+1}
          </div>
        )}
      </div>

      <h3>Total: ₹{(selectedSeats.length * bus.price) || 0}</h3>
      <button onClick={book} style={btn}>Confirm Booking</button>
    </div>
  );
}

const grid={display:"grid",gridTemplateColumns:"repeat(5,60px)",gap:10,margin:"30px 0"};
const seat={padding:15,borderRadius:8,textAlign:"center",cursor:"pointer",fontWeight:"600"};
const btn={padding:"12px 20px",background:"#2563eb",color:"#fff",border:"none",borderRadius:6};
