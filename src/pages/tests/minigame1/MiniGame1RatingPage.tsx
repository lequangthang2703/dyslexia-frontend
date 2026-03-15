import { useNavigate } from "react-router-dom";
import MinigameSuccessPage from "../../../components/tests/minigame/MinigameSuccessPage";

const MiniGame1RatingPage = () => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate("/test/minigame1/instruction");
  };

  return (
    <MinigameSuccessPage
      gameName="Trò chơi 1 - Spelling Bee"
      message="Con đã hoàn thành trò chơi Spelling Bee!"
      onPlayAgain={handlePlayAgain}
    />
  );
};

export default MiniGame1RatingPage;
