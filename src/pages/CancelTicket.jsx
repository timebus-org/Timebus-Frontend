import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // adjust path if needed

export default function CancelTicket() {
  const [ticketId, setTicketId] = useState("");
  const [otp, setOtp] = useState("");
  const [session, setSession] = useState(null);
  const [step, setStep] = useState("INIT"); // INIT | OTP_SENT | DONE
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  /* ================= MAIN ACTION ================= */
  const cancelTicket = async () => {
    if (!ticketId) return alert("Enter Ticket ID");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/cancel-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          otp: session ? null : otp, // OTP only if logged out
          loggedIn: !!session,
        }),
      });

      const data = await res.json();

      // OTP flow for logged-out users
      if (data.otpSent) {
        setStep("OTP_SENT");
        alert("OTP sent to registered email");
        return;
      }

      setResult(data);
      setStep("DONE");
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={title}>Cancel Ticket</h2>

        <input
          style={inp}
          placeholder="Enter Ticket ID / PNR"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          disabled={step !== "INIT"}
        />

        {/* OTP ONLY FOR LOGGED-OUT USERS */}
        {!session && step === "OTP_SENT" && (
          <input
            style={inp}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        <button style={btn} onClick={cancelTicket} disabled={loading}>
          {loading ? "Processing..." : "Cancel Ticket"}
        </button>

        {result && (
          <div style={msg}>
            <p>{result.message}</p>
            {result.refundAmount !== undefined && (
              <p><b>Refund Amount:</b> ₹{result.refundAmount}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#eef3ff",
};

const card = {
  width: "420px",
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const title = {
  marginBottom: "16px",
  fontSize: "20px",
};

const inp = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#ff3b30",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const msg = {
  marginTop: "16px",
  fontSize: "14px",
  background: "#f6f7fb",
  padding: "10px",
  borderRadius: "6px",
};
