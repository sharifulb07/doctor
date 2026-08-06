import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDentistDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  email: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  bio: string;
  clinicLocation: string;
  clinicPhone: string;
  photo?: string;
  availableDays: string[];
  availableTimeSlots: string[];
  availableDayTimes: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  maxAppointmentsPerDay: number;
  consultationFee: number;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DentistSchema = new Schema<IDentistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Dentist name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      maxlength: [200, "Specialization cannot exceed 200 characters"],
    },
    qualifications: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 20,
        message: "Cannot have more than 20 qualifications",
      },
    },
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"],
      max: [60, "Experience cannot exceed 60 years"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
      default: "",
    },
    clinicLocation: {
      type: String,
      required: [true, "Clinic location is required"],
      trim: true,
      maxlength: [500, "Clinic location cannot exceed 500 characters"],
    },
    clinicPhone: {
      type: String,
      required: [true, "Clinic phone is required"],
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number"],
    },
    photo: {
      type: String,
      trim: true,
    },
    availableDays: {
      type: [String],
      enum: DAYS_OF_WEEK,
      default: [],
    },
    availableTimeSlots: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) =>
          v.every((t) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t)),
        message: "Time slots must be in HH:MM format",
      },
    },
    availableDayTimes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    maxAppointmentsPerDay: {
      type: Number,
      default: 10,
      min: [1, "Maximum appointments per day must be at least 1"],
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Fee cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

DentistSchema.index({ userId: 1 });
DentistSchema.index({ specialization: 1 });
DentistSchema.index({ isActive: 1 });
DentistSchema.index({ rating: -1 });

const Dentist: Model<IDentistDocument> =
  mongoose.models.Dentist ||
  mongoose.model<IDentistDocument>("Dentist", DentistSchema);

export default Dentist;
