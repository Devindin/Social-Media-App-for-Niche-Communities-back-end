const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const authMiddleware = require('../Middleware/authMiddleware');

// Like status endpoint
router.get('/posts/:postId/like-status', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Initialize likedBy array if it doesn't exist
        if (!post.likedBy) {
            post.likedBy = [];
        }

        const liked = post.likedBy.includes(req.user.id);
        res.json({ liked, likes: post.likes || 0 });
    } catch (error) {
        console.error('Error in like-status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like/unlike endpoint
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Initialize likedBy array if it doesn't exist
        if (!post.likedBy) {
            post.likedBy = [];
        }

        const userIndex = post.likedBy.indexOf(req.user.id);
        let liked = false;

        if (userIndex === -1) {
            // Add like
            post.likedBy.push(req.user.id);
            post.likes = (post.likes || 0) + 1;
            liked = true;
        } else {
            // Remove like
            post.likedBy.splice(userIndex, 1);
            post.likes = Math.max(0, (post.likes || 1) - 1);
            liked = false;
        }

        await post.save();
        res.json({ liked, likes: post.likes });
    } catch (error) {
        console.error('Error in like endpoint:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add comment to post
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            userId: req.user.id,
            userName: req.body.userName,
            content: content
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;