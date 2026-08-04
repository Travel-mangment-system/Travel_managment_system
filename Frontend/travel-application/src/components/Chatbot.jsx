import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! Where do you want to travel?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Oops! Cannot connect to the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Action Button (Shows when chat is closed) */}
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={toggleChat}>
          💬 Chat
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* New, reliable robot image URL */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="AI Bot"
            className="robot-avatar"
          />

          <div className="chatbot-header">
            <span style={{ fontWeight: "bold", color: "#666" }}>
              AI Assistant
            </span>
            <button className="icon-btn close-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                <div className={`message-bubble ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message-bubble ai typing">Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gradient Bottom Area & Input */}
          <div className="chatbot-bottom-section">
            <div className="gradient-overlay"></div>
            <form onSubmit={sendMessage} className="chatbot-input-form">
              <div className="input-glow-wrapper">
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-btn"
                >
                  ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
