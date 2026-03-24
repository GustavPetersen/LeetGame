import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health/")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h1>LeetGame</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;