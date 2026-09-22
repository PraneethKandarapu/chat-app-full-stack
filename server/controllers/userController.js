const { getAllUsersService } = require("../services/userServices.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.json(users);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { getAllUsers };