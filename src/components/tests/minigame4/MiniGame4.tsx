import { useNavigate } from "react-router-dom";
import SpaceRescueGame from "./uncheck";

export default function MiniGame4() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/test/minigame4/rating");
  };

  return <SpaceRescueGame studentName="Phi Hành Gia Nhí" onExit={handleExit} />;
}
