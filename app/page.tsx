import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import HomePageUI from "@/components/home/HomePageUI";
import { IDentist } from "@/types";
import { developedServices, getAllServices } from "@/lib/services";

export const dynamic = "force-dynamic";

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
