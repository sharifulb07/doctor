import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailContent from "@/components/services/ServiceDetailContent";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import { IDentist } from "@/types";
import {
  getAllServiceSlugs,
  getServiceBySlug,
  getServicesBySlugs,
} from "@/lib/services";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested dental service was not found.",
    };
  }

  return {
    title: `${service.name} | Dental Services`,
    description: service.shortDescription,
  };
}

async function getRelevantDentists(serviceSpecializations: string[]) {
  try {
    await connectDB();

    const escaped = serviceSpecializations.map((s) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );

    const regex = new RegExp(escaped.join("|"), "i");

    const dentists = await Dentist.find({
      isActive: true,
      $or: [
        { specialization: { $regex: regex } },
        { qualifications: { $elemMatch: { $regex: regex } } },
      ],
    })
      .select(
        "name specialization experience rating totalReviews consultationFee clinicLocation availableDays photo",
      )
      .sort({ rating: -1 })
      .limit(4)
      .lean();

    return dentists.map(
      (dentist: IDentist & { _id: { toString(): string } }) => ({
        ...dentist,
        _id: dentist._id.toString(),
      }),
    ) as Array<IDentist & { _id: string }>;
  } catch {
    return [];
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const relatedServices = getServicesBySlugs(service.relatedServiceSlugs);
  const doctors = await getRelevantDentists(service.specializations);

  return (
    <ServiceDetailContent
      service={service}
      relatedServices={relatedServices}
      doctors={doctors}
    />
  );
}
