import React, { useEffect, useState } from "react";
import axios from "axios";

interface RankingEntry {
  _id: string;
  userId: string;
  point: number;
  claimedAt: string;
}

interface UserInfo {
  userId: string;
  userName: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const rankRes = await axios.get("http://localhost:3000/points/ranking");
        const rankData: RankingEntry[] = rankRes.data.data;

        const userRes = await axios.get("http://localhost:3000/user/ranklist");
        const users: UserInfo[] = userRes.data.data;

        const userMap = Object.fromEntries(users.map(u => [u.userId, u.userName]));

        const leaderboardWithNames: LeaderboardEntry[] = rankData.map((entry, idx) => ({
          rank: idx + 1,
          userId: entry.userId,
          userName: userMap[entry.userId] || "Unknown",
          points: entry.point,
        }));

        setLeaderboard(leaderboardWithNames);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🏆 Leaderboard</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.userId}
                  className="odd:bg-white even:bg-gray-50 hover:bg-yellow-100 transition"
                >
                  <td className="px-4 py-2 font-semibold text-center">{entry.rank}</td>
                  <td className="px-4 py-2">{entry.userName}</td>
                  <td className="px-4 py-2">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
