import type { Metadata } from "next";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Dentist from "@/models/Dentist";
import DentistProfileContent from "@/components/dentists/DentistProfileContent";

type Props = { params: Promise<{ id: string }> };

type DentistProfileClient = {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  totalReviews: number;
  consultationFee: number;
  clinicLocation: string;
  clinicPhone?: string;
  bio?: string;
  photo?: string;
  availableDays: string[];
  availableTimeSlots: string[];
  availableDayTimes?: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  qualifications: string[];
};

function toClientDentist(raw: {
  _id: { toString(): string };
  name?: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  totalReviews?: number;
  consultationFee?: number;
  clinicLocation?: string;
  clinicPhone?: string;
  bio?: string;
  photo?: string;
  availableDays?: string[];
  availableTimeSlots?: string[];
  availableDayTimes?: Record<
    string,
    Array<{ startTime: string; endTime: string }>
  >;
  qualifications?: string[];
}): DentistProfileClient {
  return {
    _id: raw._id.toString(),
    name: raw.name ?? "",
    specialization: raw.specialization ?? "",
    experience: raw.experience ?? 0,
    rating: raw.rating ?? 0,
    totalReviews: raw.totalReviews ?? 0,
    consultationFee: raw.consultationFee ?? 0,
    clinicLocation: raw.clinicLocation ?? "",
    clinicPhone: raw.clinicPhone,
    bio: raw.bio,
    photo: raw.photo,
    availableDays: raw.availableDays ?? [],
    availableTimeSlots: raw.availableTimeSlots ?? [],
    availableDayTimes: raw.availableDayTimes ?? {},
    qualifications: raw.qualifications ?? [],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isValidObjectId(id)) return { title: "Dentist Not Found" };
  try {
    await connectDB();
    const dentist = await Dentist.findOne({ _id: id, isActive: true })
      .select("name specialization experience clinicLocation")
      .lean();
    if (!dentist) return { title: "Dentist Not Found" };
    return {
      title: `Dr. ${dentist.name}`,
      description: `${dentist.specialization} with ${dentist.experience} years of experience at ${dentist.clinicLocation}`,
    };
  } catch {
    return { title: "Dentist Profile" };
  }
}

export default async function DentistProfilePage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  let dentist;
  try {
    await connectDB();
    dentist = await Dentist.findOne({ _id: id, isActive: true })
      .select(
        "name specialization experience rating totalReviews consultationFee clinicLocation clinicPhone bio photo availableDays availableTimeSlots availableDayTimes qualifications",
      )
      .lean();
  } catch {
    notFound();
  }

  if (!dentist) notFound();

  const plainDentist = toClientDentist(
    dentist as {
      _id: { toString(): string };
      name?: string;
      specialization?: string;
      experience?: number;
      rating?: number;
      totalReviews?: number;
      consultationFee?: number;
      clinicLocation?: string;
      clinicPhone?: string;
      bio?: string;
      photo?: string;
      availableDays?: string[];
      availableTimeSlots?: string[];
      availableDayTimes?: Record<
        string,
        Array<{ startTime: string; endTime: string }>
      >;
      qualifications?: string[];
    },
  );

  return <DentistProfileContent dentist={plainDentist} id={id} />;
}
