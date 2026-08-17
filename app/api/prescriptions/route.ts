import { NextRequest } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth";
import Appointment from "@/models/Appointment";
import Dentist from "@/models/Dentist";
import Prescription from "@/models/Prescription";
import { UserRole } from "@/types";
import { createdResponse, errorResponse, forbiddenResponse, serverErrorResponse, unauthorizedResponse, validationErrorResponse } from "@/utils/apiResponse";
import { formatZodErrors } from "@/utils/validators";
import { requireSameOrigin, sanitizeMultilineText, sanitizeText } from "@/utils/sanitize";

const medicineSchema = z.object({
  name: z.string().min(1).max(150),
  strength: z.string().max(50).optional().default(""),
  dosage: z.string().min(1).max(100),
  frequency: z.string().min(1).max(100),
  duration: z.string().min(1).max(100),
  instructions: z.string().max(200).optional().default(""),
});

const dentalQuadrantsSchema = z.object({
  upperLeft: z.string().max(250).optional().default(""),
  upperRight: z.string().max(250).optional().default(""),
  lowerLeft: z.string().max(250).optional().default(""),
  lowerRight: z.string().max(250).optional().default(""),
});

const prescriptionSchema = z.object({
  appointmentId: z.string().regex(/^[a-f\d]{24}$/i),
  patientAge: z.number().int().min(0).max(130).optional(),
  patientGender: z.string().max(30).optional().default(""),
  diagnosis: z.string().min(1).max(1000),
  complaints: z.string().max(1000).optional().default(""),
  onExamination: z.string().max(1000).optional().default(""),
  medicalHistory: z.string().max(1000).optional().default(""),
  treatmentPlan: z.string().max(1000).optional().default(""),
  complaintQuadrants: dentalQuadrantsSchema.optional(),
  examinationQuadrants: dentalQuadrantsSchema.optional(),
  investigationQuadrants: dentalQuadrantsSchema.optional(),
  diagnosisQuadrants: dentalQuadrantsSchema.optional(),
  treatmentPlanQuadrants: dentalQuadrantsSchema.optional(),
  medicines: z.array(medicineSchema).min(1).max(30),
  advice: z.string().max(2000).optional().default(""),
  investigations: z.string().max(1000).optional().default(""),
  followUpDate: z.string().date().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const originError = requireSameOrigin(req);
  if (originError) return originError;
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorizedResponse();
  if (auth.role !== UserRole.DENTIST) return forbiddenResponse();

  let body: unknown;
  try { body = await req.json(); } catch { return errorResponse("Invalid JSON body"); }
  const parsed = prescriptionSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(formatZodErrors(parsed.error));

  try {
    await connectDB();
    const dentist = await Dentist.findOne({ userId: auth.userId });
    if (!dentist) return forbiddenResponse("Dentist profile not found");
    const appointment = await Appointment.findOne({ _id: parsed.data.appointmentId, dentistId: dentist._id })
      .populate("patientId", "name email phone role");
    if (!appointment) return errorResponse("Patient appointment not found", 404);

    const linkedPatient = appointment.patientId as unknown as { _id?: Types.ObjectId; email?: string; role?: UserRole } | null;
    const isPatient = linkedPatient?.role === UserRole.PATIENT;
    const data = parsed.data;
    const prescription = await Prescription.create({
      dentistId: dentist._id,
      appointmentId: appointment._id,
      patientId: isPatient ? linkedPatient?._id : undefined,
      patientName: sanitizeText(appointment.patientName),
      patientEmail: isPatient ? sanitizeText(linkedPatient?.email || "") : "",
      patientPhone: sanitizeText(appointment.phone),
      patientAge: data.patientAge,
      patientGender: sanitizeText(data.patientGender),
      diagnosis: sanitizeMultilineText(data.diagnosis),
      complaints: sanitizeMultilineText(data.complaints),
      onExamination: sanitizeMultilineText(data.onExamination),
      medicalHistory: sanitizeMultilineText(data.medicalHistory),
      treatmentPlan: sanitizeMultilineText(data.treatmentPlan),
      complaintQuadrants: sanitizeQuadrants(data.complaintQuadrants),
      examinationQuadrants: sanitizeQuadrants(data.examinationQuadrants),
      investigationQuadrants: sanitizeQuadrants(data.investigationQuadrants),
      diagnosisQuadrants: sanitizeQuadrants(data.diagnosisQuadrants),
      treatmentPlanQuadrants: sanitizeQuadrants(data.treatmentPlanQuadrants),
      medicines: data.medicines.map((medicine) => ({
        name: sanitizeText(medicine.name), strength: sanitizeText(medicine.strength),
        dosage: sanitizeText(medicine.dosage), frequency: sanitizeText(medicine.frequency),
        duration: sanitizeText(medicine.duration), instructions: sanitizeText(medicine.instructions),
      })),
      advice: sanitizeMultilineText(data.advice),
      investigations: sanitizeMultilineText(data.investigations),
      followUpDate: data.followUpDate ? new Date(`${data.followUpDate}T00:00:00.000Z`) : undefined,
    });
    return createdResponse(prescription, "Prescription created");
  } catch { return serverErrorResponse(); }
}

function sanitizeQuadrants(quadrants?: z.infer<typeof dentalQuadrantsSchema>) {
  if (!quadrants) return undefined;
  return {
    upperLeft: sanitizeText(quadrants.upperLeft),
    upperRight: sanitizeText(quadrants.upperRight),
    lowerLeft: sanitizeText(quadrants.lowerLeft),
    lowerRight: sanitizeText(quadrants.lowerRight),
  };
}
