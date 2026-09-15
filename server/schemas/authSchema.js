const { z } = require("zod");
const registerSchema = z.object({
  username: z.string().min(3, "username must be atleast 3 characters"),
  email: z.string().email("please enter a valid email"),
  password: z.string().min(8, "password must be alteast 8 charecters"),
});

const loginSchema = z.object({
  email: z.string().email("enter a valid email"),
  password: z.string().min(8, "password must be atleast 8 charecters"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
