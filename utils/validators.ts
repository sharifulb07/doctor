import { z } from "zod";
import { UserRole } from "@/types";

// ─── Common Validators ────────────────────────────────────────────────────────

const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID format");

const timeSlotSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format");

const dayTimeRangeSchema = z
  .object({
    startTime: timeSlotSchema,
    endTime: timeSlotSchema,
  })
  .refine(
    ({ startTime, endTime }) => {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      return endTotal > startTotal;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: phoneSchema.optional().or(z.literal("")),
    dateOfBirth: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  role: z.enum([UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN]),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

// ─── Dentist Schemas ──────────────────────────────────────────────────────────

export const dentistProfileSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  specialization: z.string().min(2).max(200).trim(),
  qualifications: z.array(z.string().max(200)).max(20),
  experience: z.number().int().min(0).max(60),
  bio: z.string().max(2000).trim().optional().or(z.literal("")),
  clinicLocation: z.string().min(5).max(500).trim(),
  clinicPhone: phoneSchema,
  photo: z.string().url().optional().or(z.literal("")),
  availableDays: z.array(z.enum(DAYS_OF_WEEK)).min(1),
  availableTimeSlots: z.array(timeSlotSchema).min(1),
  availableDayTimes: z
    .partialRecord(z.enum(DAYS_OF_WEEK), z.array(dayTimeRangeSchema).min(1))
    .optional()
    .default({}),
  maxAppointmentsPerDay: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10),
  consultationFee: z.number().min(0),
});

// ─── Appointment Schemas ──────────────────────────────────────────────────────

export const bookAppointmentSchema = z.object({
  dentistId: objectIdSchema,
  appointmentDate: z
    .string()
    .datetime({ message: "Invalid date format" })
    .refine(
      (d) => new Date(d) > new Date(),
      "Appointment date must be in the future",
    ),
  timeSlot: timeSlotSchema,
  patientName: z.string().min(2).max(100).trim(),
  phone: phoneSchema,
  notes: z.string().max(1000).trim().optional().or(z.literal("")),
  treatmentType: z.string().max(200).trim().optional().or(z.literal("")),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  cancellationReason: z.string().max(500).trim().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  appointmentDate: z
    .string()
    .datetime()
    .refine(
      (d) => new Date(d) > new Date(),
      "Appointment date must be in the future",
    ),
  timeSlot: timeSlotSchema,
});

// ─── Availability Schemas ─────────────────────────────────────────────────────

export const availabilitySchema = z.object({
  dentistId: objectIdSchema,
  date: z
    .string()
    .datetime()
    .refine((d) => new Date(d) >= new Date(), "Date must not be in the past"),
  timeSlots: z.array(timeSlotSchema).min(1),
  isAvailable: z.boolean().optional().default(true),
});

// ─── Pagination Schema ────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) errors[path] = [];
    errors[path].push(issue.message);
  }
  return errors;
}
