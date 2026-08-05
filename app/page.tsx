import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import HomePageUI from "@/components/home/HomePageUI";
import { IDentist } from "@/types";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;

const getFeaturedDentists = unstable_cache(
  async () => {
    try {
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
    } catch {
      return [];
    }
  },
  ["home-featured-dentists"],
  { revalidate: 3600, tags: ["dentists"] },
);

export default async function HomePage() {
  const dentists = await getFeaturedDentists();
  return <HomePageUI dentists={dentists} />;
}
