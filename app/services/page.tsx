import type { Metadata } from "next";
import ServicesPageContent from "@/components/services/ServicesPageContent";
import { getAllServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Dental Services",
  description:
    "Explore all dental services with treatment details, procedure steps, recovery guidance, and booking options.",
};

export default function ServicesPage() {
  const services = getAllServices();
  return <ServicesPageContent services={services} />;
}
