const express = require("express");

const router = express.Router();

router.post("/messages", (req, res) => {
  console.log(req.body);
  res.json({
    message: req.body.content,
  });
});

module.exports = router;
