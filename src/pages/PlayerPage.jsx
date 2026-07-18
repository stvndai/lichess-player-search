import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { getPlayer, getPlayerRatingHistory } from "../api/LichessApi";
import RatingChart from "../components/RatingChart";

const GAME_TYPES = ["Bullet", "Blitz", "Rapid", "Classical", "Puzzle"];

function RatingsGrid({ perfs, username, colorClass }) {
  return (
    <div>
      <h2 className={`text-lg font-semibold mb-3 px-1 ${colorClass}`}>
        {username}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {GAME_TYPES.filter((type) => perfs[type.toLowerCase()]?.rating).map(
          (type) => (
            <div key={type} className="card bg-base-100 shadow p-4 text-center">
              <p className="text-xs text-base-content/50 uppercase tracking-widest mb-1">
                {type}
              </p>
              <p className={`text-2xl font-bold ${colorClass}`}>
                {perfs[type.toLowerCase()].rating}
              </p>
              <p className="text-xs text-base-content/40 mt-1">
                {perfs[type.toLowerCase()].games} games
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function PlayerPage() {
  const { username } = useParams();
  const navigate = useNavigate();

  // Primary player
  const [player, setPlayer] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Compare player
  const [compareInput, setCompareInput] = useState("");
  const [comparePlayer, setComparePlayer] = useState(null);
  const [compareHistory, setCompareHistory] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);

  const [selectedType, setSelectedType] = useState("Blitz");

  // Fetch primary player
  useEffect(() => {
    setLoading(true);
    setError(null);
    setComparePlayer(null);
    setCompareHistory([]);
    setCompareInput("");
    Promise.all([getPlayer(username), getPlayerRatingHistory(username)])
      .then(([playerData, historyData]) => {
        setPlayer(playerData);
        setRatingHistory(historyData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  // Fetch compare player
  function handleCompareSubmit(e) {
    e.preventDefault();
    if (!compareInput.trim()) return;
    setCompareLoading(true);
    setCompareError(null);
    setComparePlayer(null);
    setCompareHistory([]);
    Promise.all([
      getPlayer(compareInput.trim()),
      getPlayerRatingHistory(compareInput.trim()),
    ])
      .then(([playerData, historyData]) => {
        setComparePlayer(playerData);
        setCompareHistory(historyData);
      })
      .catch(() => setCompareError(`Player "${compareInput}" not found.`))
      .finally(() => setCompareLoading(false));
  }

  if (loading)
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );

  const perfs = player?.perfs ?? {};
  const comparePerfs = comparePlayer?.perfs ?? {};

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top bar — navigate to new primary player */}
        <div className="flex justify-between items-center">
          <h2 className="text-sm text-base-content/50">Search a Player</h2>
          <form
            className="join w-full max-w-md shadow"
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.search.value.trim();
              if (val) navigate(`/player/${val}`);
            }}
          >
            <input
              name="search"
              type="text"
              placeholder="Search another player..."
              className="input input-bordered join-item w-full focus:outline-none"
            />
            <button type="submit" className="btn btn-primary join-item">
              Search
            </button>
          </form>
        </div>

        {/* Player Header */}
        <div className="card bg-base-100 shadow p-6 flex flex-row items-center gap-4">
          <div className="text-5xl">♟</div>
          <div>
            <h1 className="text-3xl font-bold">{player.username}</h1>
            {player.profile?.country && (
              <p className="text-base-content/60 text-sm mt-1">
                {player.profile.country}
              </p>
            )}
          </div>
        </div>

        {/* Current Ratings */}
        <RatingsGrid
          perfs={perfs}
          username={player.username}
          colorClass="text-primary"
        />

        {/* Compare search */}
        <div className="card bg-base-100 shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Compare with another player</h2>
          <form
            className="join w-full max-w-md shadow"
            onSubmit={handleCompareSubmit}
          >
            <input
              type="text"
              placeholder="Enter Lichess username..."
              className="input input-bordered join-item w-full focus:outline-none"
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary join-item">
              {compareLoading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Compare"
              )}
            </button>
          </form>

          {compareError && (
            <div className="alert alert-error">
              <span>{compareError}</span>
            </div>
          )}
        </div>

        {/* Compare player ratings */}
        {comparePlayer && (
          <RatingsGrid
            perfs={comparePerfs}
            username={comparePlayer.username}
            colorClass="text-secondary"
          />
        )}

        <RatingChart
          primaryUsername={player.username}
          primaryHistory={ratingHistory}
          compareUsername={comparePlayer?.username}
          compareHistory={compareHistory}
        />
      </div>
    </div>
  );
}
