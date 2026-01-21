export default function BusCard({ bus, onViewSeats }) {
  const seatsLeft = bus.seats.filter(s => s.status === "AVAILABLE").length;

  return (
    <div style={styles.card}>
      <div style={styles.left}>
        {bus.assured && <span style={styles.assured}>Abhi Assured</span>}

        <h3 style={styles.busName}>{bus.busName}</h3>
        <p style={styles.busType}>{bus.busType}</p>

        <p style={styles.berths}>
          {bus.singleBerths} Single Berths ({bus.berthLayout})
        </p>
      </div>

      <div style={styles.center}>
        <div style={styles.timeBlock}>
          <strong>{bus.departureTime}</strong>
          <span>{bus.from}</span>
        </div>

        <div style={styles.duration}>
          <span>{bus.duration}</span>
        </div>

        <div style={styles.timeBlock}>
          <strong>{bus.arrivalTime}</strong>
          <span>{bus.to}</span>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.price}>
          From <strong>₹{bus.discountedPrice}</strong>
        </div>

        <button style={styles.selectBtn} onClick={onViewSeats}>
          Select Seats
        </button>

        <div style={styles.seatsLeft}>
          {seatsLeft} Seats Left
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    marginBottom: 20
  },
  assured: {
    background: "#2563eb",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12
  },
  busName: { margin: "6px 0", fontWeight: 700 },
  busType: { color: "#475569" },
  berths: { fontSize: 12, color: "#64748b" },
  center: { display: "flex", alignItems: "center", gap: 20 },
  timeBlock: { textAlign: "center" },
  duration: {
    padding: "4px 12px",
    border: "1px solid #c7d2fe",
    borderRadius: 20,
    fontSize: 12
  },
  right: { textAlign: "right" },
  price: { marginBottom: 10 },
  selectBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer"
  },
  seatsLeft: {
    marginTop: 6,
    color: "#16a34a",
    fontSize: 12
  }
};
