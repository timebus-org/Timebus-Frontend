import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/user/${localStorage.getItem("userId")}`)
      .then(res => setBookings(res.data));
  }, []);

  return (
    <div style={{padding:40}}>
      <h2>My Bookings</h2>

      {bookings.map(b => (
        <div key={b._id}
          style={{
            marginTop:20,
            padding:20,
            borderRadius:12,
            boxShadow:"0 5px 20px rgba(0,0,0,0.1)"
          }}
        >
          <h3>{b.bus.busName}</h3>
          <p>{b.bus.from} → {b.bus.to}</p>
          <p>Seats: {b.seats.join(", ")}</p>
          <p>Amount Paid: ₹{b.amount}</p>
          <p>Status: ✅ Confirmed</p>
        </div>
      ))}
    </div>
  );
}
