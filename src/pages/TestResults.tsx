import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { testSessionService } from "../services/testSessionService";
import { useTestProgress } from "../hooks/useTestProgress";
import type { TestSession } from "../types/testSession";

const TestResults = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { progress, resetProgress } = useTestProgress();
  const [session, setSession] = useState<TestSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        let targetSessionId = sessionId
          ? parseInt(sessionId)
          : progress.currentSessionId;

        if (!targetSessionId) {
          // Try to get the most recent completed session
          const sessions = await testSessionService.getAllTestSessions();
          const completedSession = sessions.find(
            (s: TestSession) => s.completed
          );
          if (completedSession) {
            targetSessionId = completedSession.id;
          }
        }

        if (targetSessionId) {
          const sessionData = await testSessionService.getTestSessionById(
            targetSessionId
          );
          setSession(sessionData);
        } else {
          setError("No completed test session found.");
        }
      } catch (err: any) {
        console.error("Failed to fetch session:", err);
        setError(err.message || "Failed to load test results");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, progress.currentSessionId]);

  const getResultDisplay = (result: string | null) => {
    switch (result) {
      case "NON_DYSLEXIC":
        return {
          title: "Kết quả: Không có dấu hiệu",
          description:
            "Dựa trên kết quả bài test, bạn không có dấu hiệu khó đọc. Tuy nhiên, nếu bạn vẫn gặp khó khăn trong việc đọc, hãy trao đổi với giáo viên hoặc phụ huynh.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          emoji: "🎉",
        };
      case "MAYBE_DYSLEXIC":
        return {
          title: "Kết quả: Có thể có dấu hiệu",
          description:
            "Kết quả cho thấy bạn có thể có một số dấu hiệu khó đọc. Chúng tôi khuyến nghị bạn nên tham khảo ý kiến của chuyên gia giáo dục hoặc bác sĩ để được tư vấn thêm.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          emoji: "⚠️",
        };
      case "DYSLEXIC":
        return {
          title: "Kết quả: Có dấu hiệu khó đọc",
          description:
            "Kết quả cho thấy bạn có dấu hiệu khó đọc. Đừng lo lắng! Khó đọc không ảnh hưởng đến trí thông minh của bạn. Hãy tham khảo ý kiến bác sĩ hoặc chuyên gia để được hỗ trợ tốt nhất.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          emoji: "❤️",
        };
      default:
        return {
          title: "Kết quả: Đang xử lý",
          description:
            "Kết quả của bạn đang được xử lý. Vui lòng quay lại sau.",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          emoji: "⏳",
        };
    }
  };

  const handleStartNewTest = () => {
    resetProgress();
    navigate("/human");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-cyan rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 font-semibold">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-cyan rounded-2xl flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            Không tìm thấy kết quả
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Không tìm thấy kết quả bài test."}
          </p>
          <button
            onClick={handleGoToDashboard}
            className="bg-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-pink-600 transition"
          >
            Quay về Dashboard
          </button>
        </div>
      </div>
    );
  }

  const resultDisplay = getResultDisplay(session.result);

  return (
    <div className="min-h-screen bg-gradient-cyan rounded-2xl flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{resultDisplay.emoji}</div>
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            Kết Quả Bài Test
          </h1>
          <p className="text-gray-500">
            Hoàn thành ngày{" "}
            {new Date(session.start_time).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Result Card */}
        <div
          className={`${resultDisplay.bgColor} ${resultDisplay.borderColor} border-2 rounded-xl p-6 mb-8`}
        >
          <h2 className={`text-2xl font-bold ${resultDisplay.color} mb-3`}>
            {resultDisplay.title}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resultDisplay.description}
          </p>
        </div>

        {/* Score Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">👂</div>
            <h3 className="font-semibold text-blue-700">Thính giác</h3>
            {session.taken_auditory_test ? (
              <>
                <p className="text-sm text-green-600 mb-1">✅ Hoàn thành</p>
                {session.auditory_score !== null && (
                  <p className="text-2xl font-bold text-blue-600">
                    {session.auditory_score.toFixed(1)}/100
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">⏳ Chưa hoàn thành</p>
            )}
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">👁️</div>
            <h3 className="font-semibold text-purple-700">Thị giác</h3>
            {session.taken_visual_test ? (
              <>
                <p className="text-sm text-green-600 mb-1">✅ Hoàn thành</p>
                {session.visual_score !== null && (
                  <p className="text-2xl font-bold text-purple-600">
                    {session.visual_score.toFixed(1)}/100
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">⏳ Chưa hoàn thành</p>
            )}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">📖</div>
            <h3 className="font-semibold text-orange-700">Ngôn ngữ</h3>
            {session.taken_language_test ? (
              <>
                <p className="text-sm text-green-600 mb-1">✅ Hoàn thành</p>
                {session.language_score !== null && (
                  <p className="text-2xl font-bold text-orange-600">
                    {session.language_score.toFixed(1)}/100
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">⏳ Chưa hoàn thành</p>
            )}
          </div>
        </div>

        {/* Total Score */}
        {session.total_score !== null && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">
              Điểm tổng
            </h3>
            <div className="text-4xl font-bold text-pink-700">
              {session.total_score.toFixed(1)}/100
            </div>
          </div>
        )}

        {/* Recommendation */}
        {(session.result === "MAYBE_DYSLEXIC" ||
          session.result === "DYSLEXIC") && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              💡 Khuyến nghị
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Tham khảo ý kiến bác sĩ hoặc chuyên gia tâm lý giáo dục</li>
              <li>• Thông báo cho giáo viên để nhận hỗ trợ phù hợp</li>
              <li>• Sử dụng các công cụ hỗ trợ đọc (như phần mềm đọc to)</li>
              <li>• Kiên nhẫn và tích cực trong quá trình học tập</li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoToDashboard}
            className="bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Quay về Dashboard
          </button>
          <button
            onClick={handleStartNewTest}
            className="bg-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-pink-600 transition"
          >
            Làm bài test mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
