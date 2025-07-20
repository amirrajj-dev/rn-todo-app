import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index : true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index : true
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    profilePublicId: {
      type: String,
      required: false, // For Cloudinary image deletion
    },
    wantToGetNotification : {
        type: Boolean,
        default: true
    }
  },
  {
    timestamps: true,
  }
);

const usersModel = mongoose.models.user || mongoose.model("user" , userSchema)

export default usersModel;