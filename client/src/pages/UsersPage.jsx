import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const openConversation = (userId) => {
    // console.log("Selected user: ", userId);

    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Conversation:", data);
        navigate(`/chat/${data.id}`);
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <div>
      <h1>Users</h1>

      {users.map((user) => (
        <div key={user.id} onClick={() => openConversation(user.id)}>
          <p>{user.username}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default UsersPage;
