export default function ContactUs() {
  return (
    <div style={{ padding: "60px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#0d47a1", marginBottom: "10px" }}>
        Contact Timebus
      </h1>

      <p style={{ fontSize: "16px", color: "#444", marginBottom: "30px" }}>
        We’re here to help you with bookings, payments, cancellations, and any
        questions related to Timebus services.
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        <div>
          <h3>📍 Office Address</h3>
          <p>
            Timebus Travels<br />
            Chennai, Tamil Nadu, India
          </p>
        </div>

        <div>
          <h3>📞 Customer Support</h3>
          <p>
            Phone: +91 9445656967<br />
            Support Hours: 6:00 AM – 11:00 PM
          </p>
        </div>

        <div>
          <h3>📧 Email</h3>
          <p>
            timebus.in@gmail.com<br />
            
          </p>
        </div>

        <div>
          <h3>🕒 Working Days</h3>
          <p>
            Monday – Sunday (Including Holidays)
          </p>
        </div>
      </div>
    </div>
  );
}
