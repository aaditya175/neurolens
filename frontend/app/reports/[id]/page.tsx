import { getAllPatientIds } from "@/lib/patientCatalog";
import ReportEditorClient from "./ReportEditorClient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function ReportPage({ params }: { params: { id: string } }) {
  return <ReportEditorClient initialId={params.id} />;
}
