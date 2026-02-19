import React from "react";

const Ticket = () => {

  const ticket = JSON.parse(localStorage.getItem("confirmedTicket"));

  if (!ticket) {
    return <h2>No ticket found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎟 Booking Confirmed</h2>

      <p><strong>TIN:</strong> {ticket.tin}</p>
      <p><strong>Operator:</strong> {ticket.operatorName}</p>
      <p><strong>From:</strong> {ticket.source}</p>
      <p><strong>To:</strong> {ticket.destination}</p>

      <h3>Passengers:</h3>

      {ticket.passengers?.map((p, index) => (
        <div key={index}>
          {p.name} - Seat {p.seatName}
        </div>
      ))}

    </div>
  );
};

export default Ticket;
