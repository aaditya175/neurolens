import { getAllPatientIds } from "@/lib/patientCatalog";
import CompareStudyClient from "./CompareStudyClient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function ComparePage({ params }: { params: { id: string } }) {
  return <CompareStudyClient initialId={params.id} />;
}
