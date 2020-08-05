const logger = require("../../config/logger");
const { CustomError } = require("../services/customError");
const Blog = require("../models/blog");

const createBlog = async (req, res) => {
  try {
    const author_id = req.local.user._id;
    const { title, image, body, tags } = req.body;
    if (!title || !image || !author_id || !body || !tags) {
      throw new CustomError({ message: "Incomplete Credentials" });
    }

    if (!Array.isArray(tags)) {
      throw new CustomError({ message: "Tags Should be an array" });
    }

    let tagsSet = new Set(tags);

    const newBlog = await new Blog({
      title,
      image,
      createdAt: new Date(),
      author_id,
      tags: Array.from(tagsSet),
      body
    });
    await newBlog.save();
    return res.send({ message: "Blog created", done: true, blog: newBlog });
  } catch (err) {
    let status = err.status ? err.status : 500;
    // logger.error(err);
    console.log("err", err);
    res.status(status).json({ message: err.message, done: false });
  }
};

const getBlog = async (req, res) => {
  try {
    let { authorId } = req.params;
    if (!authorId) {
      throw new CustomError({ message: "Incomplete Credentials" });
    }
    let blogs = await Blog.find({ author_id: authorId });
    return res.send({ message: "Blogs found", done: true, blogs });
  } catch (err) {
    let status = err.status ? err.status : 500;
    logger.error(err);
    res.status(status).json({ message: err.message, done: false });
  }
};

const blogRead = async (req, res) => {
  try {
    const { _id } = req.local.user;
    const { blogId } = req.body;
    if (!blogId) {
      throw new CustomError({
        message: "Incomplete Credentials blogId must be present"
      });
    }
    await Blog.findByIdAndUpdate(blogId, { $addToSet: { read: _id } });
    return res.send({ message: "blog reader marked", done: true });
  } catch (err) {
    let status = err.status ? err.status : 500;
    logger.error(err);
    res.status(status).json({ message: err.message, done: false });
  }
};

const clap = async (req, res) => {
  try {
    const { _id } = req.local.user;
    const { blogId } = req.body;
    if (!blogId) {
      throw new CustomError({
        message: "Incomplete Credentials blogId must be present"
      });
    }
    await Blog.findByIdAndUpdate(blogId, { $addToSet: { clap: _id } });
    return res.send({ message: "blog claped", done: true });
  } catch (err) {
    let status = err.status ? err.status : 500;
    logger.error(err);
    res.status(status).json({ message: err.message, done: false });
  }
};

const unClap = async (req, res) => {
  try {
    const { _id } = req.local.user;
    const { blogId } = req.body;
    if (!blogId) {
      throw new CustomError({
        message: "Incomplete Credentials blogId must be present"
      });
    }
    await Blog.findByIdAndUpdate(blogId, { $pull: { clap: _id } });
    return res.send({ message: "blog unCloped", done: true });
  } catch (err) {
    let status = err.status ? err.status : 500;
    logger.error(err);
    res.status(status).json({ message: err.message, done: false });
  }
};

module.exports = { createBlog, getBlog, blogRead, clap, unClap };
