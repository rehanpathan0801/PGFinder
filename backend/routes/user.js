const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const PG = require('../models/PG');
const { auth, authorize } = require('../middleware/auth');
const { uploadSingle, cloudinary } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/user/favorites/:pgId
// @desc    Add PG to favorites
// @access  Private (Client only)
router.post('/favorites/:pgId', auth, authorize('client'), async (req, res) => {
  try {
    const pg = await PG.findById(req.params.pgId);
    if (!pg) {
      return res.status(404).json({ message: 'PG listing not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already in favorites
    if (user.favorites.includes(req.params.pgId)) {
      return res.status(400).json({ message: 'PG already in favorites' });
    }

    user.favorites.push(req.params.pgId);
    await user.save();

    res.json({ message: 'Added to favorites successfully' });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/user/favorites/:pgId
// @desc    Remove PG from favorites
// @access  Private (Client only)
router.delete('/favorites/:pgId', auth, authorize('client'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Remove from favorites
    user.favorites = user.favorites.filter(
      favorite => favorite.toString() !== req.params.pgId
    );

    await user.save();

    res.json({ message: 'Removed from favorites successfully' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/favorites
// @desc    Get user's favorite PGs
// @access  Private (Client only)
router.get('/favorites', auth, authorize('client'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: {
        path: 'owner',
        select: 'name phone'
      }
    });

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/profile-image
// @desc    Update user profile image
// @access  Private
router.put('/profile-image', auth, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: req.file.path },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile image updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    let dashboardData = {};

    if (req.user.role === 'owner') {
      // Get owner's listings and inquiries
      const pgs = await PG.find({ owner: req.user._id })
        .populate('inquiries.user', 'name email')
        .sort({ createdAt: -1 });

      const totalListings = pgs.length;
      const totalInquiries = pgs.reduce((sum, pg) => sum + pg.inquiries.length, 0);
      const totalViews = pgs.reduce((sum, pg) => sum + pg.views, 0);

      dashboardData = {
        totalListings,
        totalInquiries,
        totalViews,
        recentListings: pgs.slice(0, 5),
        recentInquiries: pgs
          .flatMap(pg => pg.inquiries.map(inquiry => ({
            ...inquiry.toObject(),
            pgName: pg.name,
            pgId: pg._id
          })))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
      };
    } else {
      // Get client's favorites and recent searches
      const user = await User.findById(req.user._id).populate('favorites');

      dashboardData = {
        totalFavorites: user.favorites.length,
        recentFavorites: user.favorites.slice(0, 5)
      };
    }

    res.json({ dashboardData });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/search-history
// @desc    Get user's search history (placeholder for future implementation)
// @access  Private
router.get('/search-history', auth, async (req, res) => {
  try {
    // This would be implemented when search history tracking is added
    res.json({ searchHistory: [] });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    if (req.user.role === 'owner') {
      // Delete all PG listings and their images
      const pgs = await PG.find({ owner: req.user._id });

      for (const pg of pgs) {
        if (pg.images.length > 0 && cloudinary) {
          try {
            for (const image of pg.images) {
              await cloudinary.uploader.destroy(image.publicId);
            }
          } catch (cloudinaryError) {
            console.error('Error deleting images from cloudinary:', cloudinaryError);
          }
        }
      }

      await PG.deleteMany({ owner: req.user._id });
    }

    // Delete user
    await User.findByIdAndDelete(req.user._id);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
