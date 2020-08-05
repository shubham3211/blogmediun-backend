const router = require("express").Router();
const blogController = require("../controller/blogController");
const { isLogin } = require("../middleware/loginMiddleware");

router.route("/create").post(isLogin, blogController.createBlog);

router.route("/:authorId").get(isLogin, blogController.getBlog);

router.route("/read").post(isLogin, blogController.blogRead);

router.route("/clap").post(isLogin, blogController.clap);

router.route("/unClap").post(isLogin, blogController.unClap);

module.exports.router = router;
