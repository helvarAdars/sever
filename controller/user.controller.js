import User from "../models/UserSchema.js";

export const updateUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong, Please try after sometime",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile updated",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: "User profile deleted...!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return res
      .status(200)
      .json({ success: true, message: "Users found", data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const singleUserProfile = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password");

    return res
      .status(200)
      .json({ success: true, message: "User info found", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
