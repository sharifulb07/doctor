import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DevelopedServiceDetail from "@/app/developed-services/components/DevelopedServiceDetail";
import {
  getAllDevelopedServiceSlugs,
  getDevelopedServiceBySlug,
  getDevelopedServicesBySlugs,
} from "@/lib/services";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDevelopedServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getDevelopedServiceBySlug(slug);

  if (!service) {
    return {
      title: "Developed Service Not Found",
      description: "The requested developed service was not found.",
    };
  }

  return {
    title: `${service.title.en} | Developed Services`,
    description: service.shortDescription.en,
  };
}

export default async function DevelopedServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getDevelopedServiceBySlug(slug);

  if (!service) notFound();

  const relatedServices = getDevelopedServicesBySlugs(
    getAllDevelopedServiceSlugs()
      .filter((item) => item !== service.slug)
      .slice(0, 3),
  );

  return (
    <DevelopedServiceDetail
      service={service}
      relatedServices={relatedServices}
    />
  );
}
