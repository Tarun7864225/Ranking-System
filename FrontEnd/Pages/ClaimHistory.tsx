import React, { useEffect, useState } from "react";
import axios from "axios";

interface History {
  _id: string;
  userId: string;
  userName: string;
  point: number;
  claimedAt: string;
}

const ClaimHistory: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/points/history")
      .then((res) => setHistory(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📜 Claim History</h2>
      <ul className="space-y-4 max-h-[400px] overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-center text-gray-500">No claims yet.</p>
        ) : (
          history.map((h) => (
            <li
              key={h._id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition duration-200"
            >
              <div className="font-semibold text-gray-800">{h.userName}</div>
              <div className="text-gray-700">
                Claimed <span className="font-bold text-green-600">{h.point} pts</span> on{" "}
                <span className="text-gray-600">{new Date(h.claimedAt).toLocaleString()}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ClaimHistory;
