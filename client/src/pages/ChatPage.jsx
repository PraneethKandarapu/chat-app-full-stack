import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function ChatPage() {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const socketRef = useRef(null);

  /*
   * Add messages without duplicates.
   *
   * We use message.id as the unique identifier.
   */
  const addMessages = (newMessages) => {
    setMessages((previousMessages) => {
      const messageMap = new Map();

      // Existing messages
      previousMessages.forEach((message) => {
        messageMap.set(message.id, message);
      });

      // New messages
      newMessages.forEach((message) => {
        messageMap.set(message.id, message);
      });

      // Convert Map back to array
      const uniqueMessages = Array.from(messageMap.values());

      // Keep messages in chronological order
      uniqueMessages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      return uniqueMessages;
    });
  };

  /*
   * Socket.IO connection
   */
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

      // Safety check
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

  /*
   * Load existing messages from database
   */
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

        /*
         * IMPORTANT:
         *
         * We DON'T simply do:
         *
         * setMessages(data)
         *
         * because a Socket.IO message could have
         * arrived while the GET request was running.
         *
         * Instead, merge them and remove duplicates.
         */
        addMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [conversationId]);

  /*
   * Send message
   */
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

        /*
         * DO NOT add data to messages here.
         *
         * The server will send the message through
         * Socket.IO.
         */
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

      <div>
        {messages.map((message) => (
          <p key={message.id}>
            <strong>{message.sender?.username}:</strong> {message.content}
          </p>
        ))}
      </div>

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
