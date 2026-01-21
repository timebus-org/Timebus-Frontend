import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const { state } = useLocation();

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: "green" }}>✅ Booking Confirmed</h1>

      <p><b>Payment ID:</b> {state.paymentId}</p>
      <p><b>Bus:</b> {state.busName}</p>
      <p><b>Route:</b> {state.from} → {state.to}</p>
      <p><b>Seats:</b> {state.seats.join(", ")}</p>
      <p><b>Total Paid:</b> ₹{state.totalAmount}</p>

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          borderRadius: 6,
        }}
      >
        Download Ticket (Next)
      </button>
    </div>
  );
}
