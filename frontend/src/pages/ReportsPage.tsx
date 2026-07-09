import { ChartNoAxesCombined } from "lucide-react";

import FutureFeaturePage from "../components/FutureFeaturePage";

const capabilities = [
  "Summarize saved opportunities by status, source, location, and role direction.",
  "Show progress only from real user-entered tracker data once persistence exists.",
  "Prepare export-friendly career progress snapshots for personal review.",
];

function ReportsPage() {
  return (
    <FutureFeaturePage
      badge="Reports"
      title="Career progress reporting foundation"
      description="Reports will help users understand their application effort after the app has real saved opportunities and tracker history."
      icon={ChartNoAxesCombined}
      contract="Future contract"
      capabilities={capabilities}
      boundary="No charts or analytics are generated because JobTrackr does not have real tracker data yet."
    />
  );
}

export default ReportsPage;
