import Home from "./pages/Home";
import Player from "./pages/PlayerPage";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player/:username" element={<Player />} />
    </Routes>
  );
}
