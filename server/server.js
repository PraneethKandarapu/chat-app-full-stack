const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "hello from our <backend></backend>" }); //recieved to frontend as "data" object
});

// the req comes with a body, and we log it on the console
app.post("/api/messages", (req, res) => {
  console.log(req.body);
  res.json({
    message: req.body.content,
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
