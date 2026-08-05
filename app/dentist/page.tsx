import type { Metadata } from "next";
import DentistDashboardContent from "@/components/dentists/DentistDashboardContent";

export const metadata: Metadata = {
  title: "Dentist Dashboard",
  description: "Manage dentist availability and schedules",
};

export default function DentistDashboardPage() {
  return <DentistDashboardContent />;
}
