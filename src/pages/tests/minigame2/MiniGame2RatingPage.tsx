import { useNavigate } from "react-router-dom";
import MinigameSuccessPage from "../../../components/tests/minigame/MinigameSuccessPage";

const MiniGame2RatingPage = () => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    // Navigate back to the game to start a new round
    navigate("/test/minigame2/instruction");
  };

  return (
    <MinigameSuccessPage
      gameName="Trò chơi 2"
      message="Con đã hoàn thành trò chơi luyện đọc!"
      onPlayAgain={handlePlayAgain}
    />
  );
};

export default MiniGame2RatingPage;
