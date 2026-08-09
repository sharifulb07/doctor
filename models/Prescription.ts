import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPrescriptionDocument extends Document {
  dentistId: Types.ObjectId;
  patientId?: Types.ObjectId;
  appointmentId: Types.ObjectId;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  diagnosis: string;
  complaints?: string;
  medicines: Array<{
    name: string;
    strength?: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  advice?: string;
  investigations?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    strength: { type: String, trim: true, maxlength: 50 },
    dosage: { type: String, required: true, trim: true, maxlength: 100 },
    frequency: { type: String, required: true, trim: true, maxlength: 100 },
    duration: { type: String, required: true, trim: true, maxlength: 100 },
    instructions: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
);

const PrescriptionSchema = new Schema<IPrescriptionDocument>(
  {
    dentistId: { type: Schema.Types.ObjectId, ref: "Dentist", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User" },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    patientName: { type: String, required: true, trim: true, maxlength: 100 },
    patientEmail: { type: String, trim: true, lowercase: true, maxlength: 200 },
    patientPhone: { type: String, required: true, trim: true, maxlength: 30 },
    patientAge: { type: Number, min: 0, max: 130 },
    patientGender: { type: String, trim: true, maxlength: 30 },
    diagnosis: { type: String, required: true, trim: true, maxlength: 1000 },
    complaints: { type: String, trim: true, maxlength: 1000 },
    medicines: { type: [MedicineSchema], required: true },
    advice: { type: String, trim: true, maxlength: 2000 },
    investigations: { type: String, trim: true, maxlength: 1000 },
    followUpDate: Date,
  },
  { timestamps: true, versionKey: false },
);

PrescriptionSchema.index({ dentistId: 1, createdAt: -1 });
PrescriptionSchema.index({ dentistId: 1, patientId: 1, createdAt: -1 });
PrescriptionSchema.index({ appointmentId: 1, createdAt: -1 });

const Prescription: Model<IPrescriptionDocument> =
  mongoose.models.Prescription ||
  mongoose.model<IPrescriptionDocument>("Prescription", PrescriptionSchema);

export default Prescription;
