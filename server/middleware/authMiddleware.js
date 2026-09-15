const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    //   console.log(authHeader);
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization required",
      });
    }
    // extract token from authHeader
    const token = authHeader.split(" ")[1];

    // verify the token and store the verified object of user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // pass the decoded user object to the next route
    req.userId = decoded.userId; // the next route should know the verified user
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
