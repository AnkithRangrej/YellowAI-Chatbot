import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/auth";

export default function Projects({ accessToken, onSelect }) {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    fetch(`${API_BASE}/projects/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then(setProjects)
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (accessToken) fetchProjects();
  }, [accessToken]);

  const createProject = (e) => {
    e.preventDefault();
    setMessage(null);

    fetch(`${API_BASE}/projects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: projectName, description: desc }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create project");
        return res.json();
      })
      .then(() => {
        setProjectName("");
        setDesc("");
        setMessage("Project created successfully!");
        fetchProjects();
      })
      .catch((e) => setMessage(e.message));
  };

  return (
    <div>
      <h2>Your Projects</h2>

      <form onSubmit={createProject} className="form-inline">
        <input
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Create
        </button>
      </form>

      {message && <p className="msg">{message}</p>}

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ul className="projects-list">
          {projects.map((p) => (
            <li key={p.id} className="project-item">
              <button onClick={() => onSelect(p)}>{p.name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
