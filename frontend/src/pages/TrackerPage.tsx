import { ListChecks } from "lucide-react";

import FutureFeaturePage from "../components/FutureFeaturePage";

const capabilities = [
  "Move manually saved opportunities through clear application statuses.",
  "Track next actions such as apply, follow up, interview, offer, or closed.",
  "Keep tracker data grounded in user-entered opportunities instead of generated sample records.",
];

const previewItems = [
  {
    label: "Wishlist",
    detail: "Review saved opportunities before deciding whether to apply.",
  },
  {
    label: "Applied",
    detail: "Track submitted applications and follow-up timing.",
  },
  {
    label: "Interview",
    detail: "Prepare interview notes from real saved opportunity records.",
  },
  {
    label: "Offer",
    detail: "Compare outcomes only after actual user-entered progress exists.",
  },
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
      boundary="No tracker pipeline records are shown yet. The future dashboard will use real manually saved opportunities."
      previewTitle="Pipeline structure planned for JT-0005"
      previewItems={previewItems}
    />
  );
}

export default TrackerPage;
