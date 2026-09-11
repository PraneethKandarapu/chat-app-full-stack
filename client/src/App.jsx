import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:5000")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(data);
      });
  }, []);
  return (
    <div>
      <h1>Chat applicant</h1>
    </div>
  );
}

export default App;
