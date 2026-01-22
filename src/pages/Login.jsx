import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Grab redirect info from location OR localStorage
  const redirectTo = location.state?.redirectTo || localStorage.getItem("redirectTo") || "/";
  const cabData = location.state?.cabData
    || JSON.parse(localStorage.getItem("cabData")) || null;

  useEffect(() => {
    // Store redirect info in localStorage to survive reloads
    if (location.state?.redirectTo && location.state?.cabData) {
      localStorage.setItem("redirectTo", location.state.redirectTo);
      localStorage.setItem("cabData", JSON.stringify(location.state.cabData));
    }
  }, [location.state]);

  /* 🔐 PASSWORD LOGIN */
  const loginWithPassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError("Account not found. Please sign up.");
      setTimeout(() => navigate("/signup"), 1200);
      return;
    }

    // ✅ Clear redirect info from localStorage
    localStorage.removeItem("redirectTo");
    localStorage.removeItem("cabData");

    // ✅ Navigate to bookingSummary if cabData exists
    if (cabData) {
      navigate(redirectTo, { state: cabData });
    } else {
      navigate(redirectTo);
    }
  };

  /* 🔐 MAGIC LINK LOGIN */
  const sendOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/loginCallback`, // handle redirect there
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  const getEmailProviderUrl = () => {
    const domain = email.split("@")[1] || "";
    if (domain.includes("gmail")) return "https://mail.google.com";
    if (domain.includes("outlook") || domain.includes("hotmail"))
      return "https://outlook.live.com";
    if (domain.includes("yahoo")) return "https://mail.yahoo.com";
    return "mailto:";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        <p className="subtitle">
          {usePassword
            ? "Sign in using your password"
            : "Sign in using a secure email link"}
        </p>

        {!sent || usePassword ? (
          <form onSubmit={usePassword ? loginWithPassword : sendOtp}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {usePassword && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {error && <p className="error">{error}</p>}

            <button disabled={loading}>
              {loading
                ? "Please wait..."
                : usePassword
                ? "Sign In"
                : "Send Login Link"}
            </button>
          </form>
        ) : (
          <div className="email-sent">
            <h3>Check your email 📩</h3>
            <p className="subtitle">We sent a secure login link to</p>
            <strong>{email}</strong>

            <a
              href={getEmailProviderUrl()}
              target="_blank"
              rel="noreferrer"
              className="email-btn"
            >
              Go to Email
            </a>
          </div>
        )}

        {!sent && (
          <div className="auth-toggle">
            <span
              onClick={() => {
                setUsePassword(!usePassword);
                setError("");
              }}
            >
              {usePassword
                ? "Use email magic link instead"
                : "Use password instead"}
            </span>
          </div>
        )}

        <p className="switch-auth">
          Don’t have an account?{" "}
          <span
            onClick={() =>
              navigate("/signup", { state: { redirectTo, cabData } })
            }
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
