import express from "express";
import points from "../Schema/claim.js";
import User from "../Schema/user.js";

const router = express.Router();

//Points
router.post('/collectPoints',async(req,res)=>{
    try {
        const {userId} = req.body;
        if(!userId) return res.status(400).json({message:`${req.body}`});
        const user = await User.findOne({userId})
        if (!user) return res.status(400).json({message:"User not Found"});

        const lastClaim = await points.findOne({ userId: user.userId }).sort({ claimedAt: -1 });
        if (lastClaim) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (lastClaim.claimedAt > oneHourAgo) {
                const minutesLeft = Math.ceil((lastClaim.claimedAt.getTime() + 60 * 60 * 1000 - Date.now()) / 60000);
                return res.status(429).json({success: false,message: `You can claim again in ${minutesLeft} minute(s)`});
            }
        }

        const p = Math.floor(Math.random()*10)+1;
        user.userPoints+=p;
        user.save()
        await points.create({userId:user.userId,point:p})

        return res.status(200).json({message:"Points Claimed |",user})

    } catch (error) {
        console.log("ERROR:",error)
        res.status(400).json({success:false,message:"Error Collecting Points"})              
    }
})

//Rank
router.get('/ranking',async(req,res)=>{
    try {
        const rank = await points.find().sort({point:-1});
        return res.status(200).json({count:rank.legth, data:rank})
    } catch (error) {
        console.log("ERROR:",error)
        res.status(400).json({success:false,message:"Error Fetching User Points"})
    }
})

//History
router.get("/history", async (req, res) => {
    try {
        const claims = await points.find().sort({ claimedAt: -1 });
        const userIds = [...new Set(claims.map(c => c.userId))];
        const users = await User.find({ userId: { $in: userIds } });
        const userMap = Object.fromEntries(users.map(u => [u.userId, u.userName]));
        const historyWithNames = claims.map(c => ({
        _id: c._id,
        userId: c.userId,
        userName: userMap[c.userId] || "Unknown",
        point: c.point,
        claimedAt: c.claimedAt,
        }));

        res.status(200).json({ count: historyWithNames.length, data: historyWithNames });
    } catch (error) {
        console.error("ERROR:", error);
        res.status(400).json({ success: false, message: "Error Fetching History" });
    }
});

export default router;