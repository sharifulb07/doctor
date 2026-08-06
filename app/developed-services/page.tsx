import type { Metadata } from "next";
import DevelopedServicesListing from "@/app/developed-services/components/DevelopedServicesListing";
import { getAllDevelopedServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Developed Dental Services",
  description:
    "Explore our developed dental services with modern care pathways, treatment highlights, and booking guidance.",
};

export default function DevelopedServicesPage() {
  const services = getAllDevelopedServices();
  return <DevelopedServicesListing services={services} />;
}
