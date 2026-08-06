import type { Metadata } from "next";
import BestServicesListing from "@/app/best-services/components/BestServicesListing";
import { getAllBestServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Best Dental Services",
  description:
    "Browse our best dental services selected for quality outcomes, patient trust, and modern treatment approach.",
};

export default function BestServicesPage() {
  const services = getAllBestServices();
  return <BestServicesListing services={services} />;
}
