import { useNavigate } from "react-router-dom";
import MinigameSuccessPage from "../../../components/tests/minigame/MinigameSuccessPage";

const MiniGame4RatingPage = () => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate("/test/minigame4/instruction");
  };

  return (
    <MinigameSuccessPage
      gameName="Trò chơi 4 - Cứu Hộ Vũ Trụ"
      message="Con đã hoàn thành chuyến phiêu lưu vũ trụ!"
      onPlayAgain={handlePlayAgain}
    />
  );
};

export default MiniGame4RatingPage;
