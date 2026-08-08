import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import DentistsContent from "@/components/dentists/DentistsContent";
import { IDentist } from "@/types";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
  title: "Our Dental Surgeons",
  description:
    "Browse our team of qualified and experienced dental professionals.",
};

export const revalidate = 3600;

const getDentists = unstable_cache(
  async () => {
    try {
      await connectDB();
      const dentists = await Dentist.find({ isActive: true })
        .select(
          "name specialization experience rating totalReviews consultationFee clinicLocation availableDays qualifications photo",
        )
        .sort({ rating: -1, name: 1 })
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
  ["dentists-list"],
  { revalidate: 3600, tags: ["dentists"] },
);

export default async function DentistsPage() {
  const dentists = await getDentists();
  const specializations = [...new Set(dentists.map((d) => d.specialization))];
  return (
    <DentistsContent dentists={dentists} specializations={specializations} />
  );
}
