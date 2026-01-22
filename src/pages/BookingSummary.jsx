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

  // 🔐 AUTH CHECK + PROFILE FETCH
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const authUser = session.user;
      setUser(authUser);

      // Fetch from profiles table
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!error && profileData) {
        setProfile(profileData);
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (!state) return <div>No booking data</div>;
  if (loading) return <div>Loading...</div>;

  const {
    cab,
    selectedPackage,
    tripType,
    from,
    to,
    date,
    distanceKm = 0,
  } = state;

  // 🧮 Fare calculation
  let totalFare = 0;
  if (tripType === "local") {
    totalFare = selectedPackage.price;
  } else {
    const billableKm = Math.max(distanceKm, 250);
    totalFare =
      billableKm * selectedPackage.perKm +
      selectedPackage.driver;
  }

  const advance = Math.round(totalFare * 0.2);

  // 📌 Get display info: merge profile + auth metadata
  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || "";
  const displayPhone =
    profile?.phone || user?.user_metadata?.phone || "";
  const displayEmail = user?.email || profile?.email || "";

  // 🔹 Razorpay payment handler
  const handlePayment = (amount, paymentType) => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
      amount: amount * 100, // amount in paise
      currency: "INR",
      name: "TimeBus",
      description: `Payment for ${paymentType}`,
      handler: function (response) {
        // After successful payment, redirect to booking confirmation
        navigate("/bookingConfirmation", {
          state: {
            ...state,
            totalFare,
            paidAmount: amount,
            paymentType,
            user: {
              name: displayName,
              phone: displayPhone,
              email: displayEmail,
            },
            paymentId: response.razorpay_payment_id,
          },
        });
      },
      prefill: {
        name: displayName,
        email: displayEmail,
        contact: displayPhone,
      },
      theme: { color: "#2563EB" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

          <h4>Fare Calculation</h4>
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
          <h3>Fare Summary</h3>

          <div className="fare-row">
            <span>Total Fare</span>
            <span>₹{totalFare}</span>
          </div>

          <div className="fare-row">
            <span>Advance (20%)</span>
            <span>₹{advance}</span>
          </div>

          <button
            className="pay-btn secondary"
            onClick={() => handlePayment(advance, "ADVANCE")}
          >
            Pay ₹{advance} (Advance)
          </button>

          <button
            className="pay-btn primary"
            onClick={() => handlePayment(totalFare, "FULL")}
          >
            Pay ₹{totalFare} (Full)
          </button>
        </div>

      </div>
    </div>
  );
}
