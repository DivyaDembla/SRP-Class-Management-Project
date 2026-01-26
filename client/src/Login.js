import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const nodeRef = useRef(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ---------------- VALIDATION ---------------- */
  const validate = (field, value) => {
    let error = "";

    if (field === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.length < 3) error = "Name must be at least 3 characters";
    }

    if (field === "email") {
      if (!value) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Enter a valid email";
    }

    if (field === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6)
        error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation on submit
    if (!isLogin) validate("name", name);
    validate("email", email);
    validate("password", password);

    if (errors.email || errors.password || (!isLogin && errors.name)) {
      return;
    }

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert("Signup successful. Please login.");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
        setErrors({});
      }
    } catch (error) {
      alert("Server error");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <span
            onClick={() => {
              setIsLogin(true);
              setErrors({});
              setShowPassword(false);
            }}
            className={isLogin ? "active" : ""}
          >
            Login
          </span>
          <span
            onClick={() => {
              setIsLogin(false);
              setErrors({});
              setShowPassword(false);
            }}
            className={!isLogin ? "active" : ""}
          >
            Sign Up
          </span>
        </div>

        <SwitchTransition>
          <CSSTransition
            key={isLogin ? "login" : "signup"}
            nodeRef={nodeRef}
            timeout={300}
            classNames="fade-slide"
          >
            <div ref={nodeRef}>
              <h2>{isLogin ? "Login" : "Sign Up"}</h2>

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                      onBlur={(e) => validate("name", e.target.value)}
                      required
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                  </div>
                )}

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    onBlur={(e) => validate("email", e.target.value)}
                    required
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      onBlur={(e) => validate("password", e.target.value)}
                      required
                    />
                    <span
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="error-text">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={
                    errors.email || errors.password || (!isLogin && errors.name)
                  }
                >
                  {isLogin ? "Login" : "Create Account"}
                </button>
              </form>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
}
