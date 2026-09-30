import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const openConversation = (userId) => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/conversations`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create conversation");
        }

        return response.json();
      })
      .then((data) => {
        navigate(`/chat/${data.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="users-page">
      <h1>Users</h1>

      <div className="users-list">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <div className="user-info">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
            </div>

            <button onClick={() => openConversation(user.id)}>Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPage;
