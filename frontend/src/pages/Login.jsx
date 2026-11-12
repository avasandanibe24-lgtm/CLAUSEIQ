import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      console.log("Login response:", response.status, data);

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : "Invalid email or password."
        );
        return;
      }

      localStorage.setItem(
        "clauseiqUser",
        JSON.stringify(data)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to ClauseIQ server. Make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <Link to="/" className="brand">
          <div className="brand-icon">C</div>
          <div>
            <strong>ClauseIQ</strong>
            <span>Agreement Intelligence</span>
          </div>
        </Link>

        <div className="left-content">

          <div className="badge">
            AI-POWERED CONTRACT INTELLIGENCE
          </div>

          <h1>
            Understand your
            <span> agreements.</span>
          </h1>

          <p>
            Analyze contracts, identify important clauses,
            understand risks, and navigate compliance with
            ClauseIQ.
          </p>

        </div>

      </div>


      <div className="login-right">

        <div className="login-box">

          <div className="mobile-brand">
            <div className="brand-icon">C</div>
            <strong>ClauseIQ</strong>
          </div>

          <h2>
            Sign in to ClauseIQ
          </h2>

          <p className="subtitle">
            Continue to your agreement workspace.
          </p>


          <form onSubmit={handleLogin}>

            <label>
              Email address
            </label>

            <div className="input-wrapper">

              <Mail size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <label>
              Password
            </label>

            <div className="input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>


          <div className="register-text">
            Don't have an account?
            <Link to="/register">
              Create an account
            </Link>
          </div>

        </div>

      </div>


      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          background: #ffffff;
        }

        .login-left {
          width: 52%;
          min-height: 100vh;
          background: #f4f7fc;
          padding: 42px 7%;
          position: relative;
          overflow: hidden;
        }

        .login-left::after {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          border: 1px solid #dce5f4;
          right: -220px;
          bottom: -220px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: #172033;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #174ea6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 800;
        }

        .brand strong {
          display: block;
          font-size: 17px;
        }

        .brand span {
          display: block;
          font-size: 10px;
          color: #8791a3;
          margin-top: 2px;
        }

        .left-content {
          max-width: 520px;
          margin-top: 180px;
          position: relative;
          z-index: 2;
        }

        .badge {
          color: #174ea6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          margin-bottom: 20px;
        }

        .left-content h1 {
          font-size: clamp(42px, 5vw, 68px);
          line-height: 1.05;
          letter-spacing: -2.8px;
          margin: 0 0 25px;
          color: #172033;
        }

        .left-content h1 span {
          color: #174ea6;
        }

        .left-content p {
          color: #697386;
          font-size: 16px;
          line-height: 1.75;
          max-width: 470px;
          margin: 0;
        }

        .login-right {
          width: 48%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .login-box {
          width: 100%;
          max-width: 420px;
        }

        .login-box h2 {
          margin: 0 0 8px;
          font-size: 30px;
          color: #172033;
          letter-spacing: -0.8px;
        }

        .subtitle {
          color: #7b8494;
          margin: 0 0 32px;
          font-size: 14px;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          color: #344054;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .input-wrapper {
          height: 48px;
          border: 1px solid #dce1e9;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          margin-bottom: 20px;
          background: white;
        }

        .input-wrapper svg {
          color: #98a2b3;
          flex-shrink: 0;
        }

        .input-wrapper:focus-within {
          border-color: #174ea6;
          box-shadow: 0 0 0 3px rgba(23, 78, 166, 0.08);
        }

        .input-wrapper input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          font-size: 14px;
          color: #172033;
        }

        .error-message {
          background: #fff2f2;
          border: 1px solid #ffd6d6;
          color: #c0392b;
          padding: 11px 13px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 16px;
        }

        form button {
          height: 48px;
          border: none;
          border-radius: 9px;
          background: #174ea6;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        form button:hover {
          background: #123e85;
        }

        form button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .register-text {
          text-align: center;
          margin-top: 25px;
          font-size: 13px;
          color: #7b8494;
        }

        .register-text a {
          color: #174ea6;
          font-weight: 700;
          text-decoration: none;
          margin-left: 5px;
        }

        .mobile-brand {
          display: none;
        }

        @media (max-width: 800px) {

          .login-left {
            display: none;
          }

          .login-right {
            width: 100%;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 50px;
          }

          .mobile-brand strong {
            font-size: 18px;
          }

        }

      `}</style>

    </div>
  );
}

export default Login;