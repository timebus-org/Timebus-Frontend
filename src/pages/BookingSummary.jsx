import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./BookingSummary.css";

export default function BookingSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/login");
          return;
        }

        setUser(session.user);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) setProfile(profileData);
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  if (!state) return <div>No booking data found</div>;
  if (loading) return <div>Loading...</div>;

  const {
    cab,
    selectedPackage,
    tripType,
    from,
    to,
    date,
    time,
    distanceKm = 0,
  } = state;

  // 💰 Fare calculation
  let estimatedFare = 0;
  if (tripType === "local") {
    estimatedFare = selectedPackage.price;
  } else {
    const billableKm = Math.max(distanceKm, 250);
    estimatedFare =
      billableKm * selectedPackage.perKm + selectedPackage.driver;
  }

  // 👤 User info
  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || "";
  const displayPhone =
    profile?.phone || user?.user_metadata?.phone || "";
  const displayEmail = user?.email || "";

  // 🚖 SEND BOOKING REQUEST
  const handleSendRequest = async () => {
    if (!user) return;

    setSending(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/cab/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: displayName,
          phone: displayPhone,
          email: displayEmail,
          from,
          to,
          date,
          time,
          cab: cab.name,
          tripType,
          estimatedFare,
        }),
      });

      let data = null;
      const text = await res.text();

      if (text) {
        data = JSON.parse(text);
      }

      if (res.ok && data?.success) {
  // Save booking info to localStorage
  localStorage.setItem(
    "lastBooking",
    JSON.stringify({ from, to, date, time, cab: cab.name })
  );

  navigate("/booking-success");
}
 else {
        alert("Booking failed. Please try again.");
        console.error("Server response:", data);
      }
    } catch (err) {
      console.error("Booking request error:", err);
      alert("Server error. Please try later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="summary-bg">
      <div className="summary-container">
        {/* LEFT */}
        <div className="summary-left">
          <h2>{cab.name} / AC</h2>
          <p>{cab.desc}</p>

          <h4>User Details</h4>
          <p><b>Name:</b> {displayName}</p>
          <p><b>Mobile:</b> {displayPhone}</p>
          <p><b>Email:</b> {displayEmail}</p>

          <h4>Trip Details</h4>
          <p><b>From:</b> {from}</p>
          <p><b>To:</b> {to}</p>
          <p><b>Date:</b> {date}</p>
          <p><b>Time:</b> {time}</p>

          <h4>Fare Info</h4>
          {tripType === "outstation" && (
            <>
              <p>Per Km: ₹{selectedPackage.perKm}</p>
              <p>Driver Allowance: ₹{selectedPackage.driver}</p>
              <p>Billable Km: {Math.max(distanceKm, 250)}</p>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="summary-right">
          <h3>Order Summary</h3>

          <div className="fare-row">
            <span>Estimated Fare</span>
            <span>₹{estimatedFare}</span>
          </div>

          <p className="fare-note">
            * Final price confirmed by cab owner.
          </p>

          <button
            className="pay-btn primary"
            disabled={sending}
            onClick={handleSendRequest}
          >
            {sending ? "Sending..." : "Send Booking Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
