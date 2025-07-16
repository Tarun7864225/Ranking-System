import mongoose from "mongoose";

const claim = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'system',
        required: true
    },
    point: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    claimedAt: {
        type: Date,
        default: Date.now
  }
});
const points = mongoose.model('point', claim);

export default points;
