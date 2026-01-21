import { useEffect, useState } from "react";

export default function OtpTimer({ onResend }) {
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (time === 0) return;
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  return time > 0 ? (
    <p style={{ fontSize: 13, color: "#777" }}>
      Resend OTP in {time}s
    </p>
  ) : (
    <button onClick={onResend} style={resendBtn}>
      Resend OTP
    </button>
  );
}

const resendBtn = {
  background: "none",
  border: "none",
  color: "#d32f2f",
  cursor: "pointer"
};
