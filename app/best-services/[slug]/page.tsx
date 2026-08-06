import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BestServiceDetail from "@/app/best-services/components/BestServiceDetail";
import {
  getAllBestServiceSlugs,
  getBestServiceBySlug,
  getBestServicesBySlugs,
} from "@/lib/services";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBestServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getBestServiceBySlug(slug);

  if (!service) {
    return {
      title: "Best Service Not Found",
      description: "The requested best service was not found.",
    };
  }

  return {
    title: `${service.title.en} | Best Services`,
    description: service.shortDescription.en,
  };
}

export default async function BestServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getBestServiceBySlug(slug);

  if (!service) notFound();

  const relatedServices = getBestServicesBySlugs(
    getAllBestServiceSlugs()
      .filter((item) => item !== service.slug)
      .slice(0, 3),
  );

  return (
    <BestServiceDetail service={service} relatedServices={relatedServices} />
  );
}
