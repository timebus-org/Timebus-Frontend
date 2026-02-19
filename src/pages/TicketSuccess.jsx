import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./TicketSuccess.css";
import logo from "../assets/logo.png";

export default function TicketSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef();

  const [loading, setLoading] = useState(true);

  const ticket = location.state;

  /* ================= REDIRECT IF NO TICKET ================= */
  useEffect(() => {
    if (!ticket) navigate("/");
  }, [ticket, navigate]);

  /* ================= NORMALIZE INVENTORY ================= */
  const inventory = Array.isArray(ticket?.inventoryItems)
    ? ticket.inventoryItems
    : ticket?.inventoryItems
    ? [ticket.inventoryItems]
    : [];

  /* ================= FORMAT TIME ================= */
const formatTime = (time) => {
  if (!time) return "-";

  let timeStr = time.toString().padStart(4, "0");

  let hours = parseInt(timeStr.slice(0, 2), 10);
  let minutes = parseInt(timeStr.slice(2, 4), 10);

  // Fix minute overflow (like 60, 75, etc.)
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  // Handle next day overflow
  let nextDay = false;
  if (hours >= 24) {
    hours = hours % 24;
    nextDay = true;
  }

  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm} ${nextDay ? "(+1 Day)" : ""}`;
};



  /* ================= AUTO PDF ================= */
/* ================= AUTO PDF & EMAIL ================= */
useEffect(() => {
  if (!ticket) return;

  const generatePDFAndSendEmail = async () => {
    try {
      // 1️⃣ Generate PDF
      const canvas = await html2canvas(ticketRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`TimeBus_Ticket_${ticket?.tin}.pdf`);

      // 2️⃣ Send email
      const res = await fetch("http://localhost:5000/api/send-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: ticket?.email,      // user email entered during booking
          ticketData: ticket,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log(`✅ Ticket emailed to: ${ticket?.email}`);
      } else {
        console.error("❌ Failed to send ticket email:", data.message);
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ Error generating PDF or sending email:", err);
      setLoading(false);
    }
  };

  generatePDFAndSendEmail();
}, [ticket]);


  if (!ticket) return null;

  return (
    <div className="tb-wrapper">
      {loading && (
        <div className="tb-overlay">
          <div className="tb-loader"></div>
          <p>Generating your ticket...</p>
        </div>
      )}

      <div className="tb-card" ref={ticketRef}>
        
        {/* HEADER */}
        {/* ===== HEADER ===== */}
<div className="tb-header">

  <div className="tb-brand">
  <img src={logo} alt="Logo" className="tb-logo" />
  <p>e-Ticket Confirmation</p>
</div>


  <div className="tb-booked-badge">
    ✓ BOOKED
  </div>

</div>



        {/* ROUTE SECTION */}
        <div className="tb-route">
          <div>
            <h2>{ticket?.sourceCity}</h2>
            <p>{formatTime(ticket?.pickupTime)}</p>
          </div>

          <div className="tb-arrow">→</div>

          <div>
            <h2>{ticket?.destinationCity}</h2>
            <p>{formatTime(ticket?.dropTime)}</p>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="tb-section">
          <div className="tb-row">
            <span>Operator</span>
            <strong>{ticket?.travels}</strong>
          </div>
          <div className="tb-row">
            <span>Bus Type</span>
            <strong>{ticket?.busType}</strong>
          </div>
          <div className="tb-row">
            <span>Journey Date</span>
            <strong>
              {new Date(ticket?.doj).toLocaleDateString()}
            </strong>
          </div>
          <div className="tb-row">
            <span>PNR</span>
            <strong>{ticket?.pnr}</strong>
          </div>
        </div>

        {/* BOARDING DETAILS */}
        <div className="tb-section">
          <h3>Boarding & Drop Details</h3>
          <div className="tb-row">
            <span>Boarding Point</span>
            <strong>{ticket?.pickupLocation}</strong>
          </div>
          <div className="tb-row">
            <span>Boarding Contact</span>
            <strong>{ticket?.pickUpContactNo}</strong>
          </div>
          <div className="tb-row">
            <span>Drop Point</span>
            <strong>{ticket?.dropLocation}</strong>
          </div>
        </div>

        {/* PASSENGER DETAILS */}
        <div className="tb-section">
          <h3>Passenger Details</h3>
          {inventory.map((item, i) => (
            <div key={i} className="tb-passenger">
              <div>{item?.passenger?.name}</div>
              <div>
                {item?.passenger?.age} / {item?.passenger?.gender}
              </div>
              <div>Seat: {item?.seatName}</div>
            </div>
          ))}
        </div>

        {/* FARE DETAILS */}
        <div className="tb-section">
          <h3>Fare Details</h3>
          <div className="tb-row">
            <span>Base Fare</span>
            <strong>₹{inventory[0]?.baseFare}</strong>
          </div>
          <div className="tb-row">
            <span>Service Tax</span>
            <strong>₹{inventory[0]?.serviceTax}</strong>
          </div>
          <div className="tb-row tb-total">
            <span>Total Paid</span>
            <strong>₹{inventory[0]?.fare}</strong>
          </div>
        </div>

        {/* FOOTER */}
        <div className="tb-footer">
          <p>
            Please carry a valid ID proof during travel.
          </p>
          <p>
            Ticket issued on:{" "}
            {new Date(ticket?.dateOfIssue).toLocaleString()}
          </p>
        </div>

      </div>

      <div className="tb-actions">
  <button onClick={() => window.print()}>
    Print Ticket
  </button>

  <button
    className="tb-home-btn"
    onClick={() => navigate("/")}
  >
    Go To Home
  </button>
</div>

    </div>
  );
}
