const prisma = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//zod validation for registration
const { registerSchema, loginSchema } = require("../schemas/authSchema.js");

const registerUser = async (req, res) => {
  //   if (!req.body.username || !req.body.email || !req.body.password) {
  //     return res.status(400).json({
  //       message: "Username, email, and password are required",
  //     });
  //   }
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: result.error.issues,
    });
  }
  //   console.log(result);

  try {
    const hashedPass = await bcrypt.hash(result.data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPass,
      },
    });

    const { password, ...safeUser } = user;

    res.json(safeUser);
  } catch (err) {
    console.log(err);

    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  //   if (!email || !password) {
  //     return res.status(400).json({
  //       message: "Email and password are required",
  //     });
  //   }

  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "invalid login data",
      error: result.error.issues,
    });
  }
  const { email, password } = result.data;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: "invalid username or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    message: "Login successfull",
    token: token,
  });
};

const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });
  const { password, ...safeUser } = user;
  res.json(safeUser);
};

module.exports = { registerUser, loginUser, getProfile };
