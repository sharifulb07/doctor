import PrescriptionPrintView from "@/components/dentists/PrescriptionPrintView";

export default async function PrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrescriptionPrintView id={id} />;
}
