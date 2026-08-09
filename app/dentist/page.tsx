import DentalSurgeonOverview from "@/components/dentists/DentalSurgeonOverview";
import { getServerAuth } from "@/lib/auth";
import { getDentistDashboardData } from "@/lib/dentistDashboard";

export const metadata = {
  title: "Dental Surgeon Dashboard",
  description: "Manage patients, appointments, and schedules",
};

export default async function DentalSurgeonDashboardPage() {
  const auth = await getServerAuth();
  const initialData = auth
    ? await getDentistDashboardData(auth.userId)
    : null;

  return <DentalSurgeonOverview initialData={initialData} />;
}
