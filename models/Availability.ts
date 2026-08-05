import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface TimeSlotEntry {
  time: string;
  isBooked: boolean;
  appointmentId?: Types.ObjectId;
}

export interface IAvailabilityDocument extends Document {
  dentistId: Types.ObjectId;
  date: Date;
  timeSlots: TimeSlotEntry[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema = new Schema<TimeSlotEntry>(
  {
    time: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  { _id: false },
);

const AvailabilitySchema = new Schema<IAvailabilityDocument>(
  {
    dentistId: {
      type: Schema.Types.ObjectId,
      ref: "Dentist",
      required: [true, "Dentist ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    timeSlots: {
      type: [TimeSlotSchema],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Each dentist can only have one availability record per date
AvailabilitySchema.index({ dentistId: 1, date: 1 }, { unique: true });
AvailabilitySchema.index({ dentistId: 1, isAvailable: 1 });
AvailabilitySchema.index({ date: 1 });

const Availability: Model<IAvailabilityDocument> =
  mongoose.models.Availability ||
  mongoose.model<IAvailabilityDocument>("Availability", AvailabilitySchema);

export default Availability;
