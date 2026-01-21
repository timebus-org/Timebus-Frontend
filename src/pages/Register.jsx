import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    alert(error.message);
    return;
  }

  const user = data.user;

  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        name,
        phone,
        email,
      },
    ]);

  setLoading(false);

  if (profileError) {
    alert(profileError.message);
    return;
  }

  alert("Registered successfully. Please login.");
  window.location.href = "/login";
};

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register</h2>

      <form onSubmit={handleRegister} className="col-md-5 mx-auto">
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
