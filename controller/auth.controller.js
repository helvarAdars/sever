import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegistration = async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  try {
    let user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists...!" });
    }
    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashing, phone, address });

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully...!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const generateJWTToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
};

export const loginUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    const passwordCompare = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordCompare) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password...!" });
    }

    const token = generateJWTToken(user);

    const { password, role, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login success",
      data: { ...rest },
      token,
      role,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
