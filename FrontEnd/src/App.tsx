import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ClaimPoints from "../pages/ClaimPoints";
import Leaderboard from "../pages/Leaderboard";
import AddUser from "../pages/AddUser";
import ClaimHistory from "../Pages/ClaimHistory";

const App: React.FC = () => {
     const [refresh, setRefresh] = useState<number>(Date.now());
     const triggerRefresh = () => setRefresh(Date.now());

    return (
        <Router>
        <header style={{ padding: "1rem", background: "#eee", marginBottom: "1rem" }}>
            <nav style={{ display: "flex", gap: "1rem" }}>
            <Link to="/">🏠 Claim</Link>
            <Link to="/leaderboard">🏆 Leaderboard</Link>
            <Link to="/add-user">➕ Add User</Link>
            <Link to="/history">📜 History</Link>
            </nav>
        </header>

        <main style={{ padding: "1rem" }}>
            <Routes>
            <Route path="/" element={<ClaimPoints onClaimSuccess={triggerRefresh} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/history" element={<ClaimHistory />} />
            </Routes>
        </main>
        </Router>
    );
};

export default App;
