import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILogDocument extends Document {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: Record<string, unknown>;
  userId?: Types.ObjectId;
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  responseTime?: number;
  createdAt: Date;
}

const LogSchema = new Schema<ILogDocument>(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error", "debug"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    context: {
      type: Schema.Types.Mixed,
      default: {},
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ip: {
      type: String,
      maxlength: 45, // IPv6 max length
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    },
    path: {
      type: String,
      maxlength: 500,
    },
    statusCode: {
      type: Number,
    },
    responseTime: {
      type: Number, // milliseconds
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

// TTL index: auto-delete logs older than 90 days
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
LogSchema.index({ level: 1, createdAt: -1 });
LogSchema.index({ userId: 1, createdAt: -1 });
LogSchema.index({ path: 1, createdAt: -1 });

const Log: Model<ILogDocument> =
  mongoose.models.Log || mongoose.model<ILogDocument>("Log", LogSchema);

export default Log;
