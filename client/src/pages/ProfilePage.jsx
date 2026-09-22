import { useState, useEffect } from "react";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //get token from local storage
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUser(data);
      });
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
