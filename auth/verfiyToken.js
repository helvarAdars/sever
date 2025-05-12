import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

export const authorize = (req, res, next) => {
  // Get token from Headers
  const authToken = req.headers.authorization;

  // if token exists or not
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(400)
      .json({ success: false, message: "No token, Authorization denied." });
  }
  try {
    const token = authToken.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token", error });
  }
};

export const restrict = (role) => async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userRole = user.role;

    if (userRole === "admin" && role.includes("admin")) {
      next();
    } else if (userRole === "user" && role.includes("user")) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You're not Authorizes...!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
