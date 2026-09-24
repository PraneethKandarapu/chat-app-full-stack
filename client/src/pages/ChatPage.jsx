import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function ChatPage() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
    const socket = io("http://localhost:5000");

    console.log("Socket connected:", socket.id);

    socket.emit("hello", "Hello from React!");

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setMessages([]);

    console.log("========== OPENING CHAT ==========");
    console.log("Conversation ID:", conversationId);

    fetch(
      `http://localhost:5000/api/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Messages received:", data);

        setMessages(data);
      });
  }, [conversationId]);
  const sendMessage = () => {
    const token = localStorage.getItem("token");

    setIsSending(true);

    fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content,
        conversationId: Number(conversationId),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sent message:", data);

        setMessages((previousMessages) => [...previousMessages, data]);

        setContent("");
        setIsSending(false);
      });
  };

  return (
    <div>
      <h1>Chat</h1>

      {messages.map((message) => (
        <p key={message.id}>
          <strong>{message.sender.username}:</strong> {message.content}
        </p>
      ))}

      <div>
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={sendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
