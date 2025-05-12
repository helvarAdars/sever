import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: String,
  role: {
    type: String,
    enum: ["user", "admin", "superadmin", "superuser"],
    default: "user",
  },
});

export default mongoose.model("User", UserSchema);
