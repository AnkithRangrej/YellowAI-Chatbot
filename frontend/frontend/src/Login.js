import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Login({ onBack, onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    fetch(API_BASE + "/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          onLogin(data.access);
        } else {
          setMessage("Invalid credentials.");
        }
      })
      .catch(() => setMessage("Login failed."));
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="form-msg">{message}</div>
      <button className="link-btn" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
}
