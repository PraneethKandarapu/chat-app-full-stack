const express = require("express");
const prisma = require("../lib/prisma.js"); //import prisma
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/auth/register", registerUser);

router.post("/auth/login", loginUser);

router.get("/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});
module.exports = router;
