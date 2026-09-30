import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatPage.css";

function ChatPage() {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const addMessages = (newMessages) => {
    setMessages((previousMessages) => {
      const messageMap = new Map();

      previousMessages.forEach((message) => {
        messageMap.set(message.id, message);
      });

      newMessages.forEach((message) => {
        messageMap.set(message.id, message);
      });

      const uniqueMessages = Array.from(messageMap.values());

      uniqueMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      return uniqueMessages;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        return response.json();
      })
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinConversation", Number(conversationId));
    });

    socket.on("newMessage", (message) => {
      if (Number(message.conversationId) !== Number(conversationId)) {
        return;
      }

      addMessages([message]);
    });

    return () => {
      socket.emit("leaveConversation", Number(conversationId));

      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(
      `${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        return response.json();
      })
      .then((data) => {
        addMessages(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!content.trim()) {
      return;
    }

    const token = localStorage.getItem("token");

    setIsSending(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        return response.json();
      })
      .then(() => {
        setContent("");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>

      <div className="messages-container">
        {messages.map((message) => {
          const isMyMessage =
            currentUser && message.senderId === currentUser.id;

          return (
            <div
              key={message.id}
              className={
                isMyMessage
                  ? "message-wrapper my-message"
                  : "message-wrapper other-message"
              }
            >
              <div className="message-bubble">
                <div className="message-sender">{message.sender?.username}</div>

                <div className="message-content">{message.content}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
