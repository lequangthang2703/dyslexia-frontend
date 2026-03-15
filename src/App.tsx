import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
// import ProfileProtectedRoute from "./components/auth/ProfileProtectedRoute";
// import AccountProtectedRoute from "./components/auth/AccountProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HumanFeaturesForm from "./pages/HumanFeaturesForm";
import SelectProfile from "./pages/SelectProfile";
import TestResults from "./pages/TestResults";
import Training from "./pages/Training";

// Layouts
import AuditoryTestLayout from "./pages/AuditoryTestLayout";
import VisualTestLayout from "./pages/VisualTestLayout";
import LanguageTestLayout from "./pages/LanguageTestLayout";
import MiniGame1Layout from "./pages/MiniGame1Layout";
import MiniGame2Layout from "./pages/Minigame2Layout.tsx";

// Auditory Test Pages
import AuditoryTestInstructionPage from "./pages/tests/auditory/AuditoryTestInstructionPage";
import AuditoryTestPage from "./pages/tests/auditory/AuditoryTestPage";
import AuditoryTestRatingPage from "./pages/tests/auditory/AuditoryTestRatingPage";

// Visual Test Pages
import VisualTestInstructionPage from "./pages/tests/visual/VisualTestInstructionPage";
import VisualTestPage from "./pages/tests/visual/VisualTestPage";
import VisualTestRatingPage from "./pages/tests/visual/VisualTestRatingPage";

// Language Test Pages
import LanguageTestInstructionPage from "./pages/tests/language/LanguageTestInstructionPage";
import LanguageTestPage from "./pages/tests/language/LanguageTestPage";
import LanguageTestRatingPage from "./pages/tests/language/LanguageTestRatingPage";

// MiniGame1 Pages
import MiniGame1InstructionPage from "./pages/tests/minigame1/MiniGame1InstructionPage";
import MiniGame1Page from "./pages/tests/minigame1/MiniGame1Page";
import MiniGame1RatingPage from "./pages/tests/minigame1/MiniGame1RatingPage";

// MiniGame2 Pages
import MiniGame2InstructionPage from "./pages/tests/minigame2/MiniGame2InstructionPage";
import MiniGame2Page from "./pages/tests/minigame2/MiniGame2Page";
import MiniGame2RatingPage from "./pages/tests/minigame2/MiniGame2RatingPage";

// MiniGame3 Page
import MiniGame3Page from "./pages/tests/minigame3/MiniGame3Page";

// MiniGame4 Pages
import MiniGame4Layout from "./pages/MiniGame4Layout";
import MiniGame4InstructionPage from "./pages/tests/minigame4/MiniGame4InstructionPage";
import MiniGame4Page from "./pages/tests/minigame4/MiniGame4Page";
import MiniGame4RatingPage from "./pages/tests/minigame4/MiniGame4RatingPage";
import SpaceRescueGame from "./components/tests/minigame4/uncheck/SpaceRescueGame.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Profile Selection */}
          <Route path="profile/select" element={<SelectProfile />} />

          {/* Training / Minigames */}
          <Route path="training" element={<Training />} />

          {/* Protected Routes */}
          <Route path="me" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="human" element={<HumanFeaturesForm />} />
          <Route path="results" element={<TestResults />} />
          <Route path="results/:sessionId" element={<TestResults />} />

          {/* AUDITORY TEST */}
          <Route path="test/auditory" element={<AuditoryTestLayout />}>
            <Route
              path="instruction"
              element={<AuditoryTestInstructionPage />}
            />
            <Route path="questions" element={<AuditoryTestPage />} />
            <Route path="rating" element={<AuditoryTestRatingPage />} />
          </Route>

          {/* VISUAL TEST */}
          <Route path="test/visual" element={<VisualTestLayout />}>
            <Route path="instruction" element={<VisualTestInstructionPage />} />
            <Route path=":type/:cardQuantity" element={<VisualTestPage />} />
            <Route path="rating" element={<VisualTestRatingPage />} />
          </Route>

          {/* LANGUAGE TEST */}
          <Route path="test/language" element={<LanguageTestLayout />}>
            <Route
              path="instruction"
              element={<LanguageTestInstructionPage />}
            />
            <Route path="test" element={<LanguageTestPage />} />
            <Route path="rating" element={<LanguageTestRatingPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* MINIGAME 1 - Standalone (outside Layout) */}
        <Route path="test/minigame1" element={<MiniGame1Layout />}>
          <Route path="instruction" element={<MiniGame1InstructionPage />} />
          <Route path="start" element={<MiniGame1Page />} />
          <Route path="rating" element={<MiniGame1RatingPage />} />
        </Route>

        {/* MINIGAME 2 - Standalone (outside Layout) */}
        <Route path="test/minigame2" element={<MiniGame2Layout />}>
          <Route path="instruction" element={<MiniGame2InstructionPage />} />
          <Route path="start" element={<MiniGame2Page />} />
          <Route path="rating" element={<MiniGame2RatingPage />} />
        </Route>

        {/* MINIGAME 3 - Standalone (outside Layout) */}
        <Route path="test/minigame3" element={<MiniGame3Page />} />

        {/* MINIGAME 4 - Space Rescue (outside Layout) */}
        <Route path="test/minigame4" element={<MiniGame4Layout />}>
          <Route path="instruction" element={<MiniGame4InstructionPage />} />
          <Route path="start" element={<MiniGame4Page />} />
          <Route path="rating" element={<MiniGame4RatingPage />} />
        </Route>

        <Route path="test/minigame5" element={<SpaceRescueGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
