import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/auth";

export default function Chat({ accessToken, project }) {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [botTyping, setBotTyping] = useState(false);

  useEffect(() => {
    if (!project) return;
    fetch(`${API_BASE}/chat/history/${project.id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setChatHistory(data))
      .catch(() => alert("Error loading chat history"));
  }, [project, accessToken]);

  const sendMessage = () => {
    if (!chatInput || !project) return;
    setBotTyping(true);
    fetch(API_BASE + "/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        project_id: project.id,
        prompt_text: chatInput,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBotTyping(false);
        if (data.error) alert(data.error);
        else {
          setChatHistory((prev) => [
            ...prev,
            { id: Date.now(), sender: "user", message: chatInput },
            { id: Date.now() + 1, sender: "bot", message: data.response },
          ]);
          setChatInput("");
        }
      })
      .catch(() => {
        setBotTyping(false);
        alert("Error sending message");
      });
  };

  return (
    <div className="chat-section">
      <div className="chat-box">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === "user" ? "chat-message user" : "chat-message bot"}
          >
            {msg.message}
          </div>
        ))}
        {botTyping && <div className="chat-message bot">Bot is typing...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
