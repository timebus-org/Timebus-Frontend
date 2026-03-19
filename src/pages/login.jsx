import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    location.state?.redirectTo ||
    localStorage.getItem("redirectTo") ||
    "/";

  const cabData =
    location.state?.cabData ||
    JSON.parse(localStorage.getItem("cabData")) ||
    null;

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        handleRedirect();
      }
    };

    checkSession();
  }, []);

  /* ================= STORE DATA ================= */
  useEffect(() => {
    if (location.state?.redirectTo) {
      localStorage.setItem("redirectTo", location.state.redirectTo);
    }

    if (location.state?.cabData) {
      localStorage.setItem(
        "cabData",
        JSON.stringify(location.state.cabData)
      );
    }
  }, [location.state]);

  /* ================= SAVE BOOKING ================= */
  const saveBooking = async (data) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !data) return;

    await supabase.from("bookings").insert([
      {
        user_id: user.id,
        pickup: data.pickup,
        drop_location: data.drop,
        date: data.date,
      },
    ]);
  };

  /* ================= REDIRECT ================= */
  const handleRedirect = async () => {
    const storedRedirect =
      localStorage.getItem("redirectTo") || "/";

    const storedCabData = JSON.parse(
      localStorage.getItem("cabData")
    );

    localStorage.removeItem("redirectTo");
    localStorage.removeItem("cabData");

    if (storedCabData) {
      await saveBooking(storedCabData);
      navigate(storedRedirect, { state: storedCabData });
    } else {
      navigate(storedRedirect);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  /* ================= PASSWORD LOGIN ================= */
  const loginWithPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      setError("Invalid credentials");
      return;
    }

    handleRedirect();
  };

  /* ================= UI ================= */
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Welcome Back</h2>
        <p style={styles.subtitle}>
          Login to continue 🚀
        </p>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          style={styles.googleBtn}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="g"
            style={{ width: 20 }}
          />
          Continue with Google
        </button>

        <div style={styles.divider}>OR</div>

        {/* FORM */}
        <form onSubmit={loginWithPassword}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.primaryBtn}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= INLINE CSS ================= */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    width: 350,
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 20,
  },
  googleBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    display: "flex",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
    marginBottom: 15,
  },
  divider: {
    margin: "10px 0",
    color: "#94a3b8",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  primaryBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
};
