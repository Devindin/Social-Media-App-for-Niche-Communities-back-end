const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    name: String,
    caption: String,
    media: [String],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    community: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);