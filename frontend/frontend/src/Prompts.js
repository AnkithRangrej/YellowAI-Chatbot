import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api/auth';

export default function Prompts({ accessToken, project, onSelectPrompt, onBack }) {
  const [prompts, setPrompts] = useState([]);
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    if (!project) return;
    fetch(`${API_BASE}/prompts/?project=${project.id}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(res => res.json())
    .then(setPrompts);
  }, [project, accessToken]);

  const addPrompt = e => {
    e.preventDefault();
    fetch(API_BASE + '/prompts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({project: project.id, prompt_text: promptText})
    })
    .then(res => res.json())
    .then(() => {
      setPromptText('');
      fetch(`${API_BASE}/prompts/?project=${project.id}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
      })
      .then(res => res.json())
      .then(setPrompts);
    });
  };

  return (
    <div>
      <h2>Prompts for {project.name}</h2>
      <form onSubmit={addPrompt} className="form-inline">
        <input placeholder="New prompt" value={promptText} onChange={e => setPromptText(e.target.value)} required />
        <button type="submit">Add</button>
      </form>
      <ul className="prompts-list">
        {prompts.map(p => (
          <li key={p.id}>
            <button onClick={() => onSelectPrompt(p)}>{p.prompt_text}</button>
          </li>
        ))}
      </ul>
      <button onClick={onBack}>Back to Projects</button>
    </div>
  );
}
