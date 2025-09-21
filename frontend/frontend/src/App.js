import React, { useState, useEffect } from "react";
import "./App.css";

import Register from "./Register";
import Login from "./Login";
import Projects from "./Projects";
import Chat from "./Chat";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [view, setView] = useState(token ? "projects" : "home");
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    setToken("");
    setView("home");
    setProject(null);
  };

  const goToProjects = () => {
    setView("projects");
    setProject(null);
  };

  if (!token) {
    if (view === "register")
      return (
        <Register
          onBack={() => setView("home")}
          onRegister={() => setView("login")}
        />
      );

    if (view === "login")
      return (
        <Login
          onBack={() => setView("home")}
          onLogin={(token) => {
            setToken(token);
            setView("projects");
          }}
        />
      );
  }

  return (
    <div className="app-container">
      {view === "home" && !token && (
        <div className="main-container">
          <header>
            <h1>Yellow.ai Intern Portal</h1>
            <p className="subtitle">Register or Login to continue</p>
          </header>
          <div className="central-actions">
            <button onClick={() => setView("register")}>Register</button>
            <button onClick={() => setView("login")}>Login</button>
          </div>
        </div>
      )}

      {view === "projects" && token && !project && (
        <div className="main-container">
          <header>
            <h1>Yellow.ai Project Dashboard</h1>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </header>
          <Projects
            accessToken={token}
            onSelect={(project) => {
              setProject(project);
              setView("chat");
            }}
            onBack={goToProjects}
          />
          {/* Removed Back to Home button here */}
        </div>
      )}

      {view === "chat" && token && project && (
        <div className="main-container">
          <header>
            <h1>Chat - Project: {project.name}</h1>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </header>
          <button className="back-to-projects-btn" onClick={goToProjects}>
            ← Back to projects
          </button>
          <Chat accessToken={token} project={project} onBack={goToProjects} />
        </div>
      )}
    </div>
  );
}
