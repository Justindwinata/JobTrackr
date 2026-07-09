import { ListChecks } from "lucide-react";

import FutureFeaturePage from "../components/FutureFeaturePage";

const capabilities = [
  "Move manually saved opportunities through clear application statuses.",
  "Track next actions such as apply, follow up, interview, offer, or closed.",
  "Keep tracker data grounded in user-entered opportunities instead of generated sample records.",
];

function TrackerPage() {
  return (
    <FutureFeaturePage
      badge="Application Tracker"
      title="Application status workflow foundation"
      description="This page defines the future application tracking area without showing fabricated pipeline data."
      icon={ListChecks}
      contract="Future contract"
      capabilities={capabilities}
      boundary="No tracker records are shown because saved opportunity persistence is not available yet."
    />
  );
}

export default TrackerPage;
