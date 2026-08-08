import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole } from "@/types";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  isActive: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PATIENT,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for faster lookups
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ role: 1, createdAt: -1 });

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
