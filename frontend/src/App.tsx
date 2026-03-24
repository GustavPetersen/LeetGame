import { BrowserRouter, Routes, Route } from "react-router-dom";
import LevelsPage from "./pages/LevelsPage";
import LevelDetailPage from "./pages/LevelDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LevelsPage />} />
        <Route path="/levels/:slug" element={<LevelDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;