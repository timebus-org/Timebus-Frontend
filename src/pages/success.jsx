import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Success.css";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  /* ✅ FALLBACK DATA (for refresh / direct URL) */
  const data = state || {
    bookingId: "BK123456",
    tripId: "TRIP789",
    paymentId: "PAY987654",
    busName: "TimeBus Travels",
    source: "Chennai",
    destination: "Bangalore",
    journeyDate: "28 Jan 2026",
    departureTime: "10:30 PM",
    boardingPoint: "Koyambedu",
    passengers: [
      { name: "Arun", gender: "Male", age: 25, seat: "L1" },
      { name: "Priya", gender: "Female", age: 23, seat: "L2" },
    ],
    selectedSeats: ["L1", "L2"],
    totalPrice: 1598,
    contact: {
      email: "test@mail.com",
      phone: "9876543210",
    },
  };

  const {
    bookingId,
    paymentId,
    busName,
    source,
    destination,
    journeyDate,
    departureTime,
    boardingPoint,
    passengers,
    totalPrice,
    contact,
  } = data;

  /* 🎟 AUTO PDF DOWNLOAD + REDIRECT */
  useEffect(() => {
    if (!ticketRef.current) return;

    const generatePDF = async () => {
      const canvas = await html2canvas(ticketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bus_Ticket_${bookingId}.pdf`);

      setTimeout(() => navigate("/"), 2500);
    };

    generatePDF();
  }, [bookingId, navigate]);

  return (
    <div className="success-page">
      <div className="success-card">
        <h1>✅ Payment Successful</h1>
        <p>Your ticket is being downloaded</p>

        {/* 🎟 TICKET */}
        <div className="ticket" ref={ticketRef}>
          <div className="ticket-header">
            <h2><b>{busName}</b></h2>
            <span className="badge">CONFIRMED</span>
          </div>

          <div className="ticket-row">
            <span>Booking ID</span>
            <b>{bookingId}</b>
          </div>

          <div className="ticket-row">
            <span>Payment ID</span>
            <b>{paymentId}</b>
          </div>

          <div className="divider" />

          <div className="ticket-row">
            <span>Route</span>
            <b>{source} → {destination}</b>
          </div>

          <div className="ticket-row">
            <span>Date & Time</span>
            <b>{journeyDate} | {departureTime}</b>
          </div>

          <div className="ticket-row">
            <span>Boarding</span>
            <b>{boardingPoint}</b>
          </div>

          <div className="divider" />

          <h3>Passengers</h3>
          {passengers.map((p, i) => (
            <div key={i} className="passenger-line">
              <span>{p.name} ({p.gender}, {p.age})</span>
              <b>Seat {p.seat}</b>
            </div>
          ))}

          <div className="divider" />

          <div className="ticket-row total">
            <span>Total Paid</span>
            <b>₹{totalPrice}</b>
          </div>

          <div className="divider" />

          <div className="ticket-row">
            <span>Email</span>
            <b>{contact.email}</b>
          </div>

          <div className="ticket-row">
            <span>Phone</span>
            <b>{contact.phone}</b>
          </div>
        </div>

        <p className="redirect-text">Redirecting to home…</p>
      </div>
    </div>
  );
}
