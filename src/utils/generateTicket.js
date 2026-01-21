const PDFDocument = require("pdfkit");

module.exports = function generateTicket(booking, bus) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text("Bus Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Booking ID: ${booking._id}`);
    doc.text(`Bus: ${bus.busName}`);
    doc.text(`Route: ${bus.from} → ${bus.to}`);
    doc.text(`Seats: ${booking.seats.join(", ")}`);
    doc.text(`Amount Paid: ₹${booking.amount}`);
    doc.text(`Date: ${new Date(bus.date).toDateString()}`);

    doc.end();
  });
};
