import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTestProgress } from "../hooks/useTestProgress";
import { testSessionService } from "../services/testSessionService";
import type { TestSession } from "../types/testSession";
// 1. Import i18next
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // 2. Khởi tạo hàm t
  const { t } = useTranslation();

  const {
    progress,
    getNextIncompleteTest,
    isAllTestsComplete,
    syncWithBackendSession,
    resetProgress,
    setCurrentSessionId,
  } = useTestProgress();

  const handleStartNewTest = async () => {
    resetProgress();
    const newSession = await testSessionService.startTestSession();
    setCurrentSessionId(newSession.id);
    navigate("/test/auditory/instruction");
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await testSessionService.getAllTestSessions();
        setSessions(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [navigate]);

  // 3. Sửa hàm getResultText để dùng đa ngôn ngữ
  const getResultText = (result: string | null) => {
    switch (result) {
      case "NON_DYSLEXIC":
        return t('dashboard.results.non_dyslexic');
      case "MAYBE_DYSLEXIC":
        return t('dashboard.results.maybe_dyslexic');
      case "DYSLEXIC":
        return t('dashboard.results.dyslexic');
      default:
        return t('dashboard.results.waiting');
    }
  };

  const getResultColor = (result: string | null) => {
    switch (result) {
      case "NON_DYSLEXIC":
        return "text-green-600 font-bold";
      case "MAYBE_DYSLEXIC":
        return "text-yellow-600 font-bold";
      case "DYSLEXIC":
        return "text-red-600 font-bold";
      default:
        return "text-gray-500 font-semibold";
    }
  };

  const getTestStatusIcon = (completed: boolean) => {
    return completed ? "✅" : "⏳";
  };

  const handleContinueSession = (session: TestSession) => {
    syncWithBackendSession(session);
    if (!session.taken_auditory_test) {
      navigate("/test/auditory/instruction");
    } else if (!session.taken_visual_test) {
      navigate("/test/visual/instruction");
    } else if (!session.taken_language_test) {
      navigate("/test/language/instruction");
    } else {
      navigate(`/results/${session.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cyan rounded-2xl flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-600">{t('dashboard.title')}</h2>
          <button
            className="bg-pink-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition"
            onClick={handleStartNewTest}
          >
            {t('dashboard.new_test_btn')}
          </button>
        </div>

        {/* Test Progress Overview */}
        <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <h3 className="text-lg font-semibold text-pink-600 mb-3">
            {t('dashboard.progress_title')}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('dashboard.auditory_test'), completed: progress.auditory.completed },
              { label: t('dashboard.visual_test'), completed: progress.visual.completed },
              { label: t('dashboard.language_test'), completed: progress.language.completed }
            ].map((test, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl mb-1">{getTestStatusIcon(test.completed)}</span>
                <span className="text-sm font-medium text-gray-700 text-center">{test.label}</span>
                <span className="text-xs text-gray-500">
                  {test.completed ? t('dashboard.completed') : t('dashboard.pending')}
                </span>
              </div>
            ))}
          </div>

          {!isAllTestsComplete && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  const nextTest = getNextIncompleteTest();
                  if (nextTest) navigate(`/test/${nextTest}/instruction`);
                }}
                className="text-pink-600 hover:underline font-medium"
              >
                {t('dashboard.continue_prefix')} {getNextIncompleteTest()} test →
              </button>
            </div>
          )}

          {isAllTestsComplete && (
            <div className="mt-4 text-center text-green-600 font-semibold">
              {t('dashboard.all_completed')}
            </div>
          )}
        </div>

        {/* Training Zone Section */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-600">
              {t('dashboard.training_zone')}
            </h3>
            <button
              onClick={() => navigate("/training")}
              className="text-pink-600 hover:underline font-medium text-sm"
            >
              {t('dashboard.view_all')} →
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {t('dashboard.training_desc')}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((id) => {
               const gameData = [
                 { id: 1, icon: "🎮", available: true, path: "/test/minigame1/instruction" },
                 { id: 2, icon: "📖", available: true, path: "/test/minigame2/instruction" },
                 { id: 3, icon: "🧩", available: true, path: "/test/minigame3" },
                 { id: 4, icon: "🎯", available: false },
                 { id: 5, icon: "🌟", available: false },
               ].find(g => g.id === id);
               
               return (
                <button
                  key={id}
                  onClick={() => gameData?.available && gameData.path && navigate(gameData.path)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    gameData?.available ? "bg-pink-100 hover:bg-pink-200 cursor-pointer" : "bg-gray-100 opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!gameData?.available}
                >
                  <span className="text-2xl mb-1">{gameData?.icon}</span>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {t('dashboard.game')} {id}
                  </span>
                  {!gameData?.available && (
                    <span className="text-[10px] text-gray-500">{t('dashboard.coming_soon')}</span>
                  )}
                </button>
               );
            })}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-600 text-center py-10">
            {t('dashboard.no_sessions')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-pink-600 mb-3">
              {t('dashboard.history_title')}
            </h3>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-pink-50">
                  <th className="py-2 px-4 text-left font-semibold">#</th>
                  <th className="py-2 px-4 text-left font-semibold">{t('dashboard.table.date')}</th>
                  <th className="py-2 px-4 text-left font-semibold">{t('dashboard.table.time')}</th>
                  <th className="py-2 px-4 text-left font-semibold">{t('dashboard.table.status')}</th>
                  <th className="py-2 px-4 text-left font-semibold">{t('dashboard.table.score')}</th>
                  <th className="py-2 px-4 text-left font-semibold">{t('dashboard.table.result')}</th>
                  <th className="py-2 px-4 text-left font-semibold">{t('dashboard.table.action')}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, idx) => (
                  <tr key={session.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-4 font-bold">{idx + 1}</td>
                    <td className="py-2 px-4">{new Date(session.start_time).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2 px-4">
                      {session.completed ? (
                        <span className="text-green-600">✅ {t('dashboard.status.done')}</span>
                      ) : (
                        <span className="text-yellow-600">⏳ {t('dashboard.status.doing')}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">{session.total_score !== null ? `${session.total_score.toFixed(1)}/100` : "--"}</td>
                    <td className={`py-2 px-4 ${getResultColor(session.result)}`}>
                      {getResultText(session.result)}
                    </td>
                    <td className="py-2 px-4">
                      {session.completed ? (
                        <button
                          className="text-pink-600 hover:underline font-medium"
                          onClick={() => navigate(`/results/${session.id}`)}
                        >
                          {t('dashboard.status.view_result')}
                        </button>
                      ) : (
                        <button
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() => handleContinueSession(session)}
                        >
                          {t('dashboard.status.continue')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;