import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) navigate(`/player/${username.trim()}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        className="join w-full max-w-lg shadow-xl"
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          placeholder="Enter Lichess username..."
          className="input input-bordered input-primary join-item w-full focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Track Stats
        </button>
      </form>

      {/* Decorative tag list */}
    </div>
  );
}
