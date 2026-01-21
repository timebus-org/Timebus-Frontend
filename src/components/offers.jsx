export default function Offers() {
  return (
    <div style={wrap}>
      <div style={container}>
        <h1 style={title}>Bus Ticket Offers</h1>

        <p style={para}>
          Are you looking for exclusive online bus booking offers? Timebus
          brings you the best bus ticket offers, promo codes and discounts for
          booking bus tickets across India. Whether you are a new user or a
          regular traveler, you can find exciting bus booking deals on the
          Timebus website and mobile app.
        </p>

        <p style={para}>
          Timebus regularly introduces new offers and discounts to help
          customers save more on their bus journeys. Keep checking this page to
          stay updated with the latest bus ticket booking offers available on
          Timebus.
        </p>

        <h2 style={heading}>Bus Ticket Booking Offers Online at Timebus</h2>

        <p style={para}>
          Timebus provides a seamless bus booking experience with a wide range
          of bus operators, routes and seat options. Choose your preferred bus,
          select your seat, enjoy modern amenities and book your tickets at the
          lowest fares available.
        </p>

        <p style={para}>
          Book bus tickets online across India using Timebus and enjoy exclusive
          discounts, cashback offers and promotional deals. Our platform is
          designed to give you maximum savings while ensuring a comfortable and
          reliable journey.
        </p>

        <h2 style={heading}>Exclusive Timebus Offers</h2>

        <ul style={list}>
          <li>
            <b>New User Offer:</b> First-time users on Timebus can enjoy special
            discounts on their first bus ticket booking.
          </li>

          <li>
            <b>All Users Offer:</b> Both new and existing users can apply select
            offers and coupon codes while booking bus tickets.
          </li>

          <li>
            <b>Cashback Offers:</b> Get cashback on select bus bookings which
            can be used for future trips on Timebus.
          </li>

          <li>
            <b>Payment Partner Offers:</b> Avail exclusive discounts with
            payment partners such as UPI, wallets, cards and other digital
            payment methods.
          </li>

          <li>
            <b>Last-Minute Booking Deals:</b> Save more with special offers on
            last-minute bus ticket bookings.
          </li>
        </ul>

        <h2 style={heading}>Why Book with Timebus?</h2>

        <ul style={list}>
          <li>Lowest bus ticket fares across India</li>
          <li>Trusted bus operators and verified routes</li>
          <li>100% secure payments with encrypted transactions</li>
          <li>24/7 customer support for booking assistance</li>
          <li>Surprise rewards and exclusive deals</li>
        </ul>

        <h2 style={heading}>24/7 Customer Assistance</h2>

        <p style={para}>
          Need help with offers or bookings? The Timebus customer support team
          is available 24/7 to assist you with ticket bookings, cancellations,
          refunds and offer-related queries.
        </p>

        <h2 style={heading}>More Savings with Timebus</h2>

        <p style={para}>
          Book bus tickets at the best prices on Timebus and enjoy discounts,
          cashback and special promotional offers. Travel smart and save more
          on every journey.
        </p>

        <h2 style={heading}>Install Timebus App</h2>

        <p style={para}>
          Book your bus tickets anytime, anywhere with the Timebus mobile app.
          Get app-only offers, faster bookings and exclusive discounts.
        </p>

        <div style={rating}>
          ⭐ 4.8/5 based on 2,98,000+ reviews
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  background: "#f7f7f7",
  padding: "40px 0",
};

const container = {
  maxWidth: "900px",
  margin: "auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const title = {
  fontSize: "28px",
  marginBottom: "20px",
};

const heading = {
  fontSize: "20px",
  marginTop: "28px",
  marginBottom: "12px",
};

const para = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#444",
  marginBottom: "12px",
};

const list = {
  paddingLeft: "18px",
  lineHeight: "1.8",
  color: "#444",
};

const rating = {
  marginTop: "30px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#d32f2f",
  textAlign: "center",
};
