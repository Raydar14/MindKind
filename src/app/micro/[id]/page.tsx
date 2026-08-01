import { notFound } from "next/navigation";
import { getMicroDose, MICRO_DOSES } from "@/lib/microdoses";
import MicroDoseRunner from "./runner";

export function generateStaticParams() {
  return MICRO_DOSES.map((d) => ({ id: d.id }));
}

export default async function MicroDosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dose = getMicroDose(id);
  if (!dose) notFound();
  return <MicroDoseRunner dose={dose} />;
}
