import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function ChatPage() {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const socketRef = useRef(null);

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

    fetch("http://localhost:5000/api/profile", {
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
        console.log("Current user:", data);
        setCurrentUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("Joining conversation:", conversationId);

      socket.emit("joinConversation", Number(conversationId));
    });

    socket.on("newMessage", (message) => {
      console.log("========== SOCKET MESSAGE ==========");
      console.log("Message ID:", message.id);
      console.log("Content:", message.content);
      console.log("Sender ID:", message.senderId);
      console.log("Sender:", message.sender);
      console.log("Username:", message.sender?.username);
      console.log("Conversation ID:", message.conversationId);

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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Messages received from database:", data);

        console.log(
          "Message IDs:",
          data.map((message) => message.id),
        );

        addMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [conversationId]);

  const sendMessage = () => {
    if (!content.trim()) {
      return;
    }

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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Message saved:", data);
        setContent("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div>
      <h1>Chat</h1>

      {messages.map((message) => {
        const isMyMessage = currentUser && message.senderId === currentUser.id;

        return (
          <div
            key={message.id}
            style={{
              textAlign: isMyMessage ? "right" : "left",
            }}
          >
            <strong>{message.sender?.username}:</strong> {message.content}
          </div>
        );
      })}

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
