import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import DiscoverPage from "./pages/DiscoverPage";
import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportsPage";
import SavedPage from "./pages/SavedPage";
import TrackerPage from "./pages/TrackerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="tracker" element={<TrackerPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
