const logger = require("../../config/logger");
const { jwtVerify } = require("../../utils/jwt");
const { CustomError } = require("../services/customError");
const User = require("../models/user");

const isLogin = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    console.log("authorizationHeader", authorizationHeader);
    if (!authorizationHeader) {
      throw new CustomError({ message: "Unauthorized", status: 401 });
    }
    const decodedToken = await jwtVerify({
      token: authorizationHeader.split(" ")[1]
    });
    if (!decodedToken) {
      throw new CustomError({ message: "Unauthorized", status: 401 });
    }
    let user = await User.findById(decodedToken._id);

    if (!user) {
      throw new CustomError({ message: "Unaothorized", status: 401 });
    }

    if (!req.local) {
      req.local = {};
    }

    req.local.user = user;
    req.local.user.type = decodedToken.userType;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isLogin };
