const express = require("express");
const cors = require("cors");
const app = express();
const messageRoutes = require("./routes/messageRoutes");
const healthRouter = require("./routes/healthRouter");
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", messageRoutes);
// app.use("/api",messageRoutes):-
// // the req comes with a body, and we log it on the console
// app.post("/api/messages", (req, res) => {
//   console.log(req.body);
//   res.json({
//     message: req.body.content,
//   });
// });

app.use("/api", healthRouter);
// app.get("/api/health", (req, res) => {
//   res.json({ message: "hello from our <backend></backend>" }); //recieved to frontend as "data" object
// });

app.use("/api", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
