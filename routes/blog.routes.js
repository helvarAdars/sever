import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getBlogsByTopic,
  getBlogsByTopicWithMultipleQuerys,
  getBlogsByTopicWithQuery,
  getSingleBlog,
  updateBlog,
} from "../controller/blog.controller.js";
import { authorize, restrict } from "../auth/verfiyToken.js";

const route = express.Router();

// http://localhost:8000/api/v1/blog/createnewblog
route.post("/createnewblog",authorize, createBlog);
route.get("/getblogs", getBlogs);
route.delete("/deleteblog/:id",authorize,restrict(["admin"]), deleteBlog); // Restricted
route.put("/updateblog/:id", updateBlog); // Restricted
route.get("/getsinglebloginformation/:id", getSingleBlog);
route.get("/getblogsbytopic/:topic", getBlogsByTopic);
// http://localhost:8000/api/v1/blog/getblogsbytopicwithquery?topic=js
route.get("/getblogsbytopicwithquery", getBlogsByTopicWithQuery)
// http://localhost:8000/api/v1/blog/getblogsbytopicwithmltiquery?topic=js&topic=css
route.get("/getblogsbytopicwithmltiquery", getBlogsByTopicWithMultipleQuerys)

export default route;
