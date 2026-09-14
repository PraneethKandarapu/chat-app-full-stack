import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const sendMessage = () => {
    //we fetch the post route, and send body with a text message as string, the backed using express.json() will convert it to object
    fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: input,
      }),
    })
      .then((response) => {
        //converts json to js object
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setInput("");
      });
  };
  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //"data" object received from backend after get/ request
        setMessage(data.message);
      });
  }, []);
  return (
    <div>
      <h1>Chat application</h1>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />

      <button onClick={sendMessage}>Send</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
