import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  isVerified: boolean;
  isAcceotingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  verifyCode: {
    type: String,
    required: [true, "Please provide a verification code"],
  },
  verifyCodeExpires: {
    type: Date,
    required: [true, "Please provide a verification code expiration date"],
  },
  isAcceotingMessages: {
    type: Boolean,
    required: true,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;