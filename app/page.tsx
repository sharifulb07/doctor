import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import HomePageUI from "@/components/home/HomePageUI";
import { IDentist } from "@/types";
import { developedServices, getAllServices } from "@/lib/services";

// Featured dentists can be slightly stale; ISR keeps home navigations fast while
// refreshing the public data in the background once per hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Dental Appointment Booking in Khulna",
  description:
    "Find qualified dental surgeons, explore dental treatments, and book an appointment online with EasyDentalSolution in Khulna, Bangladesh.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "EasyDentalSolution — Your Smile Is Our Priority",
    description:
      "Book dental appointments online and access trusted dental care in Khulna, Bangladesh.",
    url: "/",
  },
};

async function getFeaturedDentists() {
  await connectDB();
  const dentists = await Dentist.find({ isActive: true })
    .select(
      "name specialization experience rating totalReviews consultationFee clinicLocation availableDays qualifications photo",
    )
    .sort({ rating: -1 })
    .limit(3)
    .lean();

  return dentists.map(
    (dentist: IDentist & { _id: { toString(): string } }) => ({
      ...dentist,
      _id: dentist._id.toString(),
    }),
  ) as Array<IDentist & { _id: string }>;
}

export default async function HomePage() {
  const dentists = await getFeaturedDentists();
  const carouselServices = developedServices.map(({ slug, title, image }) => ({
    slug,
    title,
    image,
  }));
  const serviceCards = getAllServices().map(({ slug, name, imageSrc }) => ({
    slug,
    name,
    imageSrc,
  }));

  return (
    <HomePageUI
      dentists={dentists}
      carouselServices={carouselServices}
      serviceCards={serviceCards}
    />
  );
}
