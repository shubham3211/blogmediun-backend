const router = require("express").Router();
const userController = require("../controller/userController");
const { isLogin } = require("../middleware/loginMiddleware");

router.route("/signup").post(userController.createUser);

router.route("/login").post(userController.loginUser);
router.route("/verify").post(isLogin, userController.verify);

module.exports.router = router;
