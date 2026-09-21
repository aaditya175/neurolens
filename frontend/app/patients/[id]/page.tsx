import { getAllPatientIds } from "@/lib/patientCatalog";
import PatientTimelineClient from "./PatientTimelineClient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function PatientPage({ params }: { params: { id: string } }) {
  return <PatientTimelineClient initialId={params.id} />;
}
