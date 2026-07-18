import { useState } from "react";

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

const GAME_TYPES = ["Bullet", "Blitz", "Rapid", "Classical", "Puzzle"];

const PLAYER_COLORS = {
  primary: {
    Bullet: "#f97316",
    Blitz: "#3b82f6",
    Rapid: "#22c55e",
    Classical: "#a855f7",
    Puzzle: "#ec4899",
  },
  compare: {
    Bullet: "#fb923c",
    Blitz: "#93c5fd",
    Rapid: "#86efac",
    Classical: "#d8b4fe",
    Puzzle: "#f9a8d4",
  },
};

function formatRatingHistory(data, gameType) {
  const category = data.find((c) => c.name === gameType);
  if (!category || category.points.length === 0) return [];
  return category.points.map(([year, month, day, rating]) => ({
    date: new Date(year, month, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    rating,
  }));
}

function mergeHistories(
  primaryData,
  compareData,
  primaryUsername,
  compareUsername,
) {
  const map = {};

  primaryData.forEach(({ date, rating }) => {
    map[date] = { date, [primaryUsername]: rating };
  });

  compareData.forEach(({ date, rating }) => {
    if (map[date]) {
      map[date][compareUsername] = rating;
    } else {
      map[date] = { date, [compareUsername]: rating };
    }
  });

  const sorted = Object.values(map).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  // Forward-fill missing values with last known rating
  let lastPrimary = null;
  let lastCompare = null;

  return sorted.map((entry) => {
    if (entry[primaryUsername] !== undefined)
      lastPrimary = entry[primaryUsername];
    if (entry[compareUsername] !== undefined)
      lastCompare = entry[compareUsername];

    return {
      ...entry,
      [primaryUsername]: lastPrimary,
      ...(compareUsername ? { [compareUsername]: lastCompare } : {}),
    };
  });
}

export default function RatingChart({
  primaryUsername,
  primaryHistory,
  compareUsername,
  compareHistory,
}) {
  const [selectedType, setSelectedType] = useState("Blitz");

  const primaryData = formatRatingHistory(primaryHistory, selectedType);
  const compareData =
    compareHistory.length > 0
      ? formatRatingHistory(compareHistory, selectedType)
      : [];

  const chartData = mergeHistories(
    primaryData,
    compareData,
    primaryUsername,
    compareUsername ?? "",
  );
  return (
    <div className="card bg-base-100 shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Rating History</h2>
        <div className="flex flex-wrap gap-2">
          {GAME_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`btn btn-xs ${selectedType === type ? "btn-primary" : "btn-ghost"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {primaryData.length === 0 && compareData.length === 0 ? (
        <p className="text-base-content/40 text-center py-12">
          No rating history available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={primaryUsername}
              stroke={PLAYER_COLORS.primary[selectedType]}
              dot={false}
              strokeWidth={2}
              connectNulls
            />
            {compareUsername && compareData.length > 0 && (
              <Line
                type="monotone"
                dataKey={compareUsername}
                stroke={PLAYER_COLORS.compare[selectedType]}
                dot={false}
                strokeWidth={2}
                strokeDasharray="5 5"
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
