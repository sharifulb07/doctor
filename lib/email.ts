import nodemailer from "nodemailer";
import { IAppointmentDocument } from "@/models/Appointment";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = `"EasyDentalSolution" <${process.env.SMTP_USER}>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Email Templates ──────────────────────────────────────────────────────────

function baseTemplate(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #0ea5e9; padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .body { padding: 32px 40px; color: #333; line-height: 1.6; }
    .badge { display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 13px; font-weight: 600; }
    .btn { display: inline-block; margin-top: 24px; padding: 12px 28px; background: #0ea5e9; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
    .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
    .info-row { margin: 8px 0; }
    .info-label { font-weight: 600; color: #0f172a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🦷 EasyDentalSolution</h1></div>
    <div class="body">${bodyHtml}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} EasyDentalSolution. All rights reserved.</p>
      <p><a href="${APP_URL}" style="color:#0ea5e9;">Visit our website</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Email Senders ────────────────────────────────────────────────────────────

export async function sendConfirmationEmail(
  to: string,
  appointment: Partial<IAppointmentDocument> & {
    dentistName?: string;
    clinicLocation?: string;
  },
): Promise<void> {
  const dateStr = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const html = baseTemplate(
    "Appointment Confirmation",
    `
    <h2>Your Appointment is Confirmed! ✅</h2>
    <p>Dear <strong>${appointment.patientName}</strong>,</p>
    <p>Your dental appointment has been <span class="badge">Confirmed</span>.</p>
    <br/>
    <div class="info-row"><span class="info-label">📅 Date:</span> ${dateStr}</div>
    <div class="info-row"><span class="info-label">⏰ Time:</span> ${appointment.timeSlot}</div>
    <div class="info-row"><span class="info-label">👨‍⚕️ Dental Surgeon:</span> ${appointment.dentistName || "N/A"}</div>
    <div class="info-row"><span class="info-label">📍 Location:</span> ${appointment.clinicLocation || "N/A"}</div>
    ${appointment.notes ? `<div class="info-row"><span class="info-label">📝 Notes:</span> ${appointment.notes}</div>` : ""}
    <br/>
    <p>Please arrive 10 minutes before your scheduled time. If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
    <a href="${APP_URL}/appointments" class="btn">View My Appointments</a>
    `,
  );

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Appointment Confirmed – ${dateStr} at ${appointment.timeSlot}`,
    html,
  });
}

export async function sendReminderEmail(
  to: string,
  appointment: Partial<IAppointmentDocument> & {
    dentistName?: string;
    clinicLocation?: string;
  },
): Promise<void> {
  const dateStr = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const html = baseTemplate(
    "Appointment Reminder",
    `
    <h2>Appointment Reminder ⏰</h2>
    <p>Dear <strong>${appointment.patientName}</strong>,</p>
    <p>This is a friendly reminder that you have a dental appointment <strong>tomorrow</strong>.</p>
    <br/>
    <div class="info-row"><span class="info-label">📅 Date:</span> ${dateStr}</div>
    <div class="info-row"><span class="info-label">⏰ Time:</span> ${appointment.timeSlot}</div>
    <div class="info-row"><span class="info-label">👨‍⚕️ Dental Surgeon:</span> ${appointment.dentistName || "N/A"}</div>
    <div class="info-row"><span class="info-label">📍 Location:</span> ${appointment.clinicLocation || "N/A"}</div>
    <br/>
    <p>Please remember to bring any relevant dental records or X-rays.</p>
    <a href="${APP_URL}/appointments" class="btn">View My Appointments</a>
    `,
  );

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Reminder: Dental Appointment Tomorrow at ${appointment.timeSlot}`,
    html,
  });
}

export async function sendCancellationEmail(
  to: string,
  appointment: Partial<IAppointmentDocument>,
  reason?: string,
): Promise<void> {
  const dateStr = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const html = baseTemplate(
    "Appointment Cancelled",
    `
    <h2>Appointment Cancelled ❌</h2>
    <p>Dear <strong>${appointment.patientName}</strong>,</p>
    <p>Your dental appointment on <strong>${dateStr}</strong> at <strong>${appointment.timeSlot}</strong> has been cancelled.</p>
    ${reason ? `<p><span class="info-label">Reason:</span> ${reason}</p>` : ""}
    <br/>
    <p>You can book a new appointment at any time.</p>
    <a href="${APP_URL}/book-appointment" class="btn">Book New Appointment</a>
    `,
  );

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Appointment Cancelled – ${dateStr}`,
    html,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<void> {
  const html = baseTemplate(
    "Welcome to EasyDentalSolution",
    `
    <h2>Welcome to EasyDentalSolution! 🦷</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for registering with EasyDentalSolution. Your account has been created successfully.</p>
    <br/>
    <p>You can now:</p>
    <ul>
      <li>Browse our team of qualified Dental Surgeons</li>
      <li>Book appointments online 24/7</li>
      <li>View and manage your appointment history</li>
      <li>Receive email reminders before your appointments</li>
    </ul>
    <a href="${APP_URL}/book-appointment" class="btn">Book Your First Appointment</a>
    `,
  );

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to EasyDentalSolution – Your Account is Ready",
    html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string,
): Promise<void> {
  const html = baseTemplate(
    "Reset your password",
    `
    <h2>Password reset request</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Use the button below to create a new password. This link expires in 15 minutes and can only be used once.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p style="margin-top:24px;font-size:13px;color:#64748b;">If you did not request this change, you can safely ignore this email.</p>
    `,
  );

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: "Reset your EasyDentalSolution password",
    html,
  });
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] || character,
  );
}

export async function sendContactEmail({
  name,
  email,
  question,
}: {
  name: string;
  email: string;
  question: string;
}): Promise<void> {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeQuestion = escapeHtml(question).replace(/\n/g, "<br />");

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject: `Website question from ${name}`,
    html: baseTemplate(
      "New website question",
      `<h2>New contact request</h2>
       <div class="info-row"><span class="info-label">Name:</span> ${safeName}</div>
       <div class="info-row"><span class="info-label">Email:</span> ${safeEmail}</div>
       <div class="info-row"><span class="info-label">Question:</span><br />${safeQuestion}</div>`,
    ),
  });
}
