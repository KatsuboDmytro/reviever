import { ChangeEvent, FormEvent, useState } from "react";

import { Bot } from "lucide-react";

import "./chatBot.scss";

interface Message {
  text: string;
  sender: "user" | "ai";
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Привіт! Я твій бізнес-асистент з ШІ. Чим я можу допомогти пану?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState<string>("");

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleSendMessage = (e: FormEvent): void => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Привіт, чим я можу допомогти пану?", sender: "ai" },
      ]);
      setInput("");
      setMessages([...messages, { text: input, sender: "user" }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-button" onClick={toggleChat}>
        <div className="chatbot-icon">
          <Bot />
        </div>
      </div>

      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h4>Business AI-Assistant</h4>
          <button onClick={toggleChat} className="close-button">
            ✖️
          </button>
        </div>
        <div className="chat-history">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Що мені зробити, щоб..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};
