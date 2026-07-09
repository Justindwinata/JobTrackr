import { BookmarkCheck } from "lucide-react";

import FutureFeaturePage from "../components/FutureFeaturePage";

const capabilities = [
  "Save opportunities manually after opening external job board search links.",
  "Store role, company, location, source, and the original job URL when persistence exists.",
  "Prepare clean opportunity records without importing or scraping job board data.",
];

function SavedPage() {
  return (
    <FutureFeaturePage
      badge="Saved Opportunities"
      title="Manual opportunity saving foundation"
      description="This page is prepared for a future workflow where users manually save interesting jobs they find from generated external searches."
      icon={BookmarkCheck}
      contract="Future contract"
      capabilities={capabilities}
      boundary="No saved records are displayed because database persistence has not been implemented yet."
    />
  );
}

export default SavedPage;
