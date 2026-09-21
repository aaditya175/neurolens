import { getAllPatientIds } from "@/lib/patientCatalog";
import StudyWorkspaceClient from "./StudyWorkspaceClient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function StudyPage({ params }: { params: { id: string } }) {
  return <StudyWorkspaceClient initialId={params.id} />;
}
