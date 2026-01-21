import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });

    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
      return;
    }

    const user = data.user;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name,
        email,
        phone,
      });

    setLoading(false);

    if (profileError) {
      setErrorMsg(profileError.message);
      return;
    }

    // ✅ Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Sign up to get started</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && <p className="error">{errorMsg}</p>}

          <button disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <span onClick={() => (window.location.href = "/login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
