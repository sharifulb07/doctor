import type { MetadataRoute } from "next";
import {
  getAllBestServiceSlugs,
  getAllDevelopedServiceSlugs,
  getAllServiceSlugs,
} from "@/lib/services";
import { SITE_URL } from "@/lib/site";

const url = (path: string) => new URL(path, SITE_URL).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/dentists"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/services"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/developed-services"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/best-services"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/privacy-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms-and-conditions"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/cookies"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = getAllServiceSlugs().map(
    (slug) => ({
      url: url(`/services/${slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const developedPages: MetadataRoute.Sitemap =
    getAllDevelopedServiceSlugs().map((slug) => ({
      url: url(`/developed-services/${slug}`),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const bestPages: MetadataRoute.Sitemap = getAllBestServiceSlugs().map(
    (slug) => ({
      url: url(`/best-services/${slug}`),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticPages, ...servicePages, ...developedPages, ...bestPages];
}
