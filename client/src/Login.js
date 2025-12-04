import React, { useState, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const nodeRef = useRef(null); // React 18 fix

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email restriction: allow basic email chars and no emojis
  const handleEmailChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, "");
    setEmail(value);
  };

  // Password restriction: allow A-Z, a-z, 0-9, and @#$%^ only
  const handlePasswordChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9@#$%^]/g, "");
    setPassword(value);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs">
          <span
            onClick={() => setIsLogin(true)}
            className={isLogin ? "active" : ""}
          >
            Login
          </span>
          <span
            onClick={() => setIsLogin(false)}
            className={!isLogin ? "active" : ""}
          >
            Sign Up
          </span>
        </div>

        {/* Animated Switch */}
        <SwitchTransition>
          <CSSTransition
            key={isLogin ? "login" : "signup"}
            nodeRef={nodeRef} // ✅ prevents findDOMNode error
            timeout={300}
            classNames="fade-slide"
          >
            <div ref={nodeRef}>
              <h2>{isLogin ? "Login" : "Sign Up"}</h2>
              <form>
                {!isLogin && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your Name" />
                  </div>
                )}

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder={isLogin ? "Enter Password" : "Create a Password"}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>

                <button type="submit" className="auth-btn">
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
