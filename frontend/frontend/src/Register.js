import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api/auth";

export default function Register({ onBack, onRegister }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message before submitting
    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
        setForm({ username: "", email: "", password: "" });
        setRegistered(true);
      } else {
        if (data.email && data.email.length) {
          setMessage(data.email[0]);
        } else if (data.username && data.username.length) {
          setMessage(data.username[0]);
        } else if (data.non_field_errors && data.non_field_errors.length) {
          setMessage(data.non_field_errors[0]);
        } else {
          setMessage("Registration failed: Please check your input.");
        }
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
      console.error("Registration error:", error);
    }
  };

  // Only show register form if not registered yet
  if (registered) {
    return (
      <div className="form-container">
        <h2>Register</h2>
        <p className="success-msg">{message}</p>
        <button onClick={() => {
          setRegistered(false);
          onRegister && onRegister();
        }}>
          Go to Login
        </button>
        <button className="link-btn" onClick={onBack}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
      <div className="form-msg">{message}</div>
      <button className="link-btn" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
}
