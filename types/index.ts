import { Types } from "mongoose";

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  PATIENT = "patient",
  DENTIST = "dentist",
  ADMIN = "admin",
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPublic = Omit<IUser, "password">;

// ─── Dentist ──────────────────────────────────────────────────────────────────

export interface IDentist {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  email: string;
  specialization: string;
  qualifications: string[];
  experience: number; // years
  bio: string;
  clinicLocation: string;
  clinicPhone: string;
  photo?: string;
  availableDays: string[]; // ['Monday', 'Tuesday', ...]
  availableTimeSlots: string[]; // ['09:00', '09:30', ...]
  availableDayTimes?: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  consultationFee: number;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export interface IAvailability {
  _id: Types.ObjectId;
  dentistId: Types.ObjectId;
  date: Date;
  timeSlots: {
    time: string;
    isBooked: boolean;
    appointmentId?: Types.ObjectId;
  }[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export interface IAppointment {
  _id: Types.ObjectId;
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

// ─── Log ──────────────────────────────────────────────────────────────────────

export interface ILog {
  _id: Types.ObjectId;
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

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface LoginFormData {
  role: UserRole;
  email: string;
  password: string;
}

export interface RegisterFormData {
  role: UserRole.PATIENT | UserRole.DENTIST;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  dateOfBirth?: string;
  specialization?: string;
  qualifications?: string[];
  bio?: string;
  clinicLocation?: string;
  clinicPhone?: string;
  availableDays?: string[];
  availableTimeSlots?: string[];
  availableDayTimes?: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  consultationFee?: number;
}

export interface BookAppointmentFormData {
  dentistId: string;
  appointmentDate: string;
  timeSlot: string;
  patientName: string;
  phone: string;
  notes?: string;
  treatmentType?: string;
}
