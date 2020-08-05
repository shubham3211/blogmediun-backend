const User = require("../models/user");
const { createJwt, jwtVerify } = require("../../utils/jwt");
const logger = require("../../config/logger");
const { CustomError } = require("../services/customError");

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({ message: "Incomplete Credentials", done: false });
    }
    await User.findOneAndDelete({ email });
    return res.send({ message: "User deleted", done: true });
  } catch (err) {
    logger.error(err);
    return res.send({ message: err.message, done: false });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;

    if (!email || !firstname || !lastname || !password) {
      throw new CustomError({ message: "Incomplete Credentials" });
    }

    let currentUser = await User.findOne({ email });

    if (currentUser) {
      return res.send({ message: "Email already exists", done: false });
    }

    if (password.length < 8) {
      throw new CustomError({
        message: "Password length should be more than 7"
      });
    }

    currentUser = await new User({
      email,
      firstname,
      lastname,
      password
    }).save();
    const jwt = await createJwt({
      _id: currentUser._id,
      userType: "User"
    });
    return res.send({
      message: "User created",
      done: true,
      jwt,
      user: {
        _id: currentUser._id,
        email: currentUser.email,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname
      }
    });
  } catch (err) {
    logger.error(err);
    return res.send({ message: err.message, done: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError({ message: "Incomplete Credentials" });
    }

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      throw new CustomError({ message: "Unauthorized", status: 401 });
    }

    const isValid = await currentUser.comparePassword(password);
    if (!isValid) {
      throw new CustomError({ message: "Unauthorized", status: 401 });
    }

    const jwt = await createJwt({
      _id: currentUser._id,
      userType: "User"
    });
    return res.send({
      message: "User login",
      done: true,
      jwt,
      user: {
        _id: currentUser._id,
        email: currentUser.email,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname
      }
    });
  } catch (err) {
    const { status } = err;
    if (!status) {
      status = 500;
    }
    logger.error(err);
    return res.status(status).send({ message: err.message, done: false });
  }
};

const verify = (req, res) => {
  return res.send({ user: req.local.user, message: "Verified", done: true });
};

module.exports = { createUser, loginUser, verify };
