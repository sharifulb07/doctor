import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { AppointmentStatus } from "@/types";

export interface IAppointmentDocument extends Document {
  patientId: Types.ObjectId;
  dentistId: Types.ObjectId;
  appointmentDate: Date;
  timeSlot: string;
  patientName: string;
  phone: string;
  notes?: string;
  status: AppointmentStatus;
  treatmentType?: string;
  cancellationReason?: string;
  reminderSent: boolean;
  confirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    dentistId: {
      type: Schema.Types.ObjectId,
      ref: "Dentist",
      required: [true, "Dentist ID is required"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (v: Date) {
          return v > new Date();
        },
        message: "Appointment date must be in the future",
      },
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Time slot must be in HH:MM format",
      ],
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Patient name must be at least 2 characters"],
      maxlength: [100, "Patient name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
    treatmentType: {
      type: String,
      trim: true,
      maxlength: [200, "Treatment type cannot exceed 200 characters"],
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, "Cancellation reason cannot exceed 500 characters"],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    confirmationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound index to prevent double-booking
AppointmentSchema.index(
  { dentistId: 1, appointmentDate: 1, timeSlot: 1, status: 1 },
  { unique: false },
);
AppointmentSchema.index({ patientId: 1, status: 1 });
AppointmentSchema.index({ dentistId: 1, appointmentDate: 1 });
AppointmentSchema.index({ status: 1, appointmentDate: 1 });
AppointmentSchema.index({ createdAt: -1 });

// Virtual populate for dentist and patient details
AppointmentSchema.virtual("dentist", {
  ref: "Dentist",
  localField: "dentistId",
  foreignField: "_id",
  justOne: true,
});

AppointmentSchema.virtual("patient", {
  ref: "User",
  localField: "patientId",
  foreignField: "_id",
  justOne: true,
});

const Appointment: Model<IAppointmentDocument> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointmentDocument>("Appointment", AppointmentSchema);

export default Appointment;
