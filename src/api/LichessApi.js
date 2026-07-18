const BASE_URL = "https://lichess.org/api";

export async function getPlayer(username) {
  const res = await fetch(`${BASE_URL}/user/${username}`);
  if (!res.ok) throw new Error("{Player not found");
  return res.json();
}

export async function getPlayerRatingHistory(username) {
  const res = await fetch(`${BASE_URL}/user/${username}/rating-history`);
  if (!res.ok) throw new Error("Could not fetch rating history");
  return res.json();
}

// export async function getMultiplePlayersRatingHistory(username) {
//   const request = usernames.map((u) => getPlayerRatingHistory(u));
//   const results = await Promise.all(requests);

//   return Object.fromEntries(username.map((u, i) => [u, results[i]]));
// }
