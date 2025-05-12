import mongoose from "mongoose";
import Blog from "../models/BlogSchema.js";
import User from "../models/UserSchema.js";

export const createBlog = async (req, res, next) => {
  const { title, topic, content, image } = req.body;

  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    let blog = new Blog({
      title,
      topic,
      content,
      image,
      user: {
        id: userId,
        name: user.name,
      },
    });

    await blog.save();

    return res
      .status(200)
      .json({ success: true, message: "Blog Saved successfully...!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    /*
    Both methods are same
    const blogs = await Blog.find({});
    */

    return res
      .status(200)
      .json({ success: true, message: "Blogs found", data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    // Validating ObjectID syntax
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Blog ID" });
    }

    const blog = await Blog.findById(blogId);

    // ID is valid but Blog is no there with this  ID
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found with this ID" });
    }

    await Blog.findByIdAndDelete(blogId);

    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully...!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found...!" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully...!",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({ succes: false, message: "Server error" });
  }
};

export const getSingleBlog = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog id" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Blog found", data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlogsByTopic = async (req, res, next) => {
  const reqTopic = req.params.topic;
  try {
    const blogs = await Blog.find({ topic: new RegExp(reqTopic, "i") });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Blog not found with tpic ${reqTopic}`,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Blogs found", data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlogsByTopicWithQuery = async (req, res, next) => {
  const { topic } = req.query;
  try {
    const blogs = await Blog.find({ topic: new RegExp(topic, "i") });

    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Blogs not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Blogs found", data: blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlogsByTopicWithMultipleQuerys = async (req, res, next) => {
  const { topic } = req.query;

  try {
    let query = {};

    query.topic = {
      $in: topic.map((curElm, index, arr) => new RegExp(curElm, "i")),
    };

    const blogs = await Blog.find(query);

    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Blogs not found...!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Blogs found", data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
