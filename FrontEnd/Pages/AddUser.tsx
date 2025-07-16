import React, { useState } from "react";
import axios from "axios";

const AddUser: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleSubmit = async () => {
    if (!userName.trim()) return;

    try {
      await axios.post("http://localhost:3000/user/addUser", { userName });
      setMessage("✅ User added successfully!");
      setStatus("success");
      setUserName("");
    } catch {
      setMessage("❌ Failed to add user. Try a different name.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">➕ Add User</h2>

      <input
        type="text"
        placeholder="Enter username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded-md transition-colors duration-200"
      >
        Add User
      </button>

      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            status === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddUser;
