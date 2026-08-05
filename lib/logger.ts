import pino, { Logger } from "pino";

const isDev = process.env.NODE_ENV === "development";

// ─── Pino Logger Instance ─────────────────────────────────────────────────────

const logger: Logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  base: {
    env: process.env.NODE_ENV,
    service: "dentist-appointment-app",
  },
  redact: {
    paths: ["password", "token", "authorization", "*.password", "*.token"],
    censor: "[REDACTED]",
  },
});

// ─── Structured Log Helpers ───────────────────────────────────────────────────

export interface RequestLogContext {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

export interface AuthLogContext {
  email: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  reason?: string;
}

export interface AppointmentLogContext {
  appointmentId?: string;
  patientId: string;
  dentistId: string;
  action: "created" | "updated" | "cancelled" | "confirmed" | "completed";
  date?: string;
  timeSlot?: string;
}

export function logRequest(ctx: RequestLogContext): void {
  const level =
    ctx.statusCode >= 500 ? "error" : ctx.statusCode >= 400 ? "warn" : "info";
  logger[level](
    { ...ctx },
    `${ctx.method} ${ctx.path} ${ctx.statusCode} ${ctx.responseTime}ms`,
  );
}

export function logAuth(ctx: AuthLogContext): void {
  if (!ctx.success) {
    logger.warn({ ...ctx }, `Failed login attempt for ${ctx.email}`);
  } else {
    logger.info(
      { email: ctx.email, ip: ctx.ip },
      `Successful login for ${ctx.email}`,
    );
  }
}

export function logAppointment(ctx: AppointmentLogContext): void {
  logger.info(
    { ...ctx },
    `Appointment ${ctx.action} by patient ${ctx.patientId}`,
  );
}

export function logError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (error instanceof Error) {
    logger.error({ ...context, stack: error.stack }, error.message);
  } else {
    logger.error({ ...context, error }, "An unknown error occurred");
  }
}

export function logSecurity(
  message: string,
  context?: Record<string, unknown>,
): void {
  logger.warn({ ...context, type: "SECURITY" }, message);
}

export default logger;
