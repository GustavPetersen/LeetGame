import { BrowserRouter, Routes, Route } from "react-router-dom";
import LevelsPage from "./pages/LevelsPage";
import LevelDetailPage from "./pages/LevelDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LevelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/levels/:slug"
          element={
            <ProtectedRoute>
              <LevelDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;