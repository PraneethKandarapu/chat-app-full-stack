import { useParams } from "react-router-dom";

function ChatPage() {
  const { conversationId } = useParams();

  return (
    <div>
      <h1>Chat</h1>
      <p>Conversation ID: {conversationId}</p>
    </div>
  );
}

export default ChatPage;
