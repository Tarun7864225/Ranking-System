import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  onClaimSuccess: () => void;
}

interface User {
  userId: string;
  userName: string;
}

const ClaimPoints: React.FC<Props> = ({ onClaimSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/ranklist")
      .then((res) => setUsers(res.data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleClaim = async () => {
    if (!selectedUser) return setMessage("⚠️ Please select a user");

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/points/collectPoints", {
        userId: selectedUser,
      });
      const { userPoints } = res.data.user;
      setMessage(`🎉 Claimed successfully! Total points: ${userPoints}`);
      onClaimSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setMessage(`❌ ${msg}`);
      const m = msg.match(/in (\d+) minute/);
      if (m) setCooldown(parseInt(m[1]) * 60);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-6 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">🎯 Claim Points</h2>

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>
            {u.userName}
          </option>
        ))}
      </select>

      <button
        disabled={cooldown > 0 || loading}
        onClick={handleClaim}
        className={`w-full py-2 rounded-md text-white font-semibold transition ${
          cooldown || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {cooldown
          ? `⏳ Wait (${formatTime(cooldown)})`
          : loading
          ? "Claiming..."
          : "Claim Points"}
      </button>

      {message && (
        <div
          className={`text-center font-medium px-4 py-2 rounded-md ${
            message.startsWith("🎉")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ClaimPoints;
