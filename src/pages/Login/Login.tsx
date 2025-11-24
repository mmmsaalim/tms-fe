import { useState, type FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginUser } from "../../services/authservice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await loginUser(email, password);

    if (result.success) {
      localStorage.setItem("token", result.token);
      window.location.href = "/dashboard";
    } else {
      setError(result.message || "Invalid email or password");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center ">
      <div className="card p-4" style={{ minWidth: "400px", width: "100%" }}>
        <h2 className="mb-4 text-center">Welcome Back!</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 mb-3">
            Login
          </button>

          <div className="d-flex justify-content-between">
            <a href="#">Create Account</a>
            <a href="#">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
