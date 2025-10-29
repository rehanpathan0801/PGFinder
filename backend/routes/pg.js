const express = require('express');
const { body, validationResult, query } = require('express-validator');
const PG = require('../models/PG');
const { auth, authorize } = require('../middleware/auth');
const { uploadMultiple, cloudinary } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/pg
// @desc    Create a new PG listing
// @access  Private (Owner only)
router.post('/', auth, authorize('owner'), uploadMultiple, [
  body('name').trim().isLength({ min: 2 }).withMessage('PG name must be at least 2 characters long'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('address').notEmpty().withMessage('Address is required'),
  body('genderPreference').isIn(['boys', 'girls', 'co-ed']).withMessage('Invalid gender preference'),
  body('roomType').isIn(['shared', 'single']).withMessage('Invalid room type'),
  body('rent').isNumeric().withMessage('Rent must be a number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse JSON strings from frontend
    let parsedData = { ...req.body };
    
    // Parse address if it's a JSON string
    if (typeof req.body.address === 'string') {
      try {
        parsedData.address = JSON.parse(req.body.address);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid address format' });
      }
    }
    
    // Parse amenities if it's a JSON string
    if (typeof req.body.amenities === 'string') {
      try {
        parsedData.amenities = JSON.parse(req.body.amenities);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid amenities format' });
      }
    }
    
    // Parse rules if it's a JSON string
    if (typeof req.body.rules === 'string') {
      try {
        parsedData.rules = JSON.parse(req.body.rules);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid rules format' });
      }
    }
    
    // Parse nearbyPlaces if it's a JSON string
    if (typeof req.body.nearbyPlaces === 'string') {
      try {
        parsedData.nearbyPlaces = JSON.parse(req.body.nearbyPlaces);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid nearby places format' });
      }
    }

    // Validate parsed address fields
    if (!parsedData.address || !parsedData.address.street || !parsedData.address.city || 
        !parsedData.address.state || !parsedData.address.pincode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const pgData = {
      ...parsedData,
      owner: req.user._id,
      rent: Number(parsedData.rent),
      capacity: Number(parsedData.capacity),
      deposit: Number(parsedData.deposit) || 0
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      try {
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      // Cloudinary is configured
      pgData.images = req.files.map(file => ({
        url: file.secure_url || file.path,         // Use secure_url if available, else path
        publicId: file.public_id || file.filename  // Use public_id if available, else filename
      }));
    } else {
      // Cloudinary not configured, skip images for now
      console.log('Cloudinary not configured, skipping image upload');
      pgData.images = [];
    }
  } catch (error) {
    console.error('Image upload error:', error);
    // Continue without images if upload fails
    pgData.images = [];
      }
    }

    const pg = new PG(pgData);
    await pg.save();

    await pg.populate('owner', 'name email phone');

    res.status(201).json({
      message: 'PG listing created successfully',
      pg
    });
  } catch (error) {
    console.error('Create PG error:', error);
    console.error('Request body:', req.body);
    console.error('Request files:', req.files);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   GET /api/pg
// @desc    Get all PG listings with filters
// @access  Public
router.get('/', [
  query('city').optional().trim(),
  query('genderPreference').optional().isIn(['boys', 'girls', 'co-ed']),
  query('roomType').optional().isIn(['shared', 'single']),
  query('minRent').optional().isNumeric(),
  query('maxRent').optional().isNumeric(),
  query('amenities').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const {
      city,
      genderPreference,
      roomType,
      minRent,
      maxRent,
      amenities,
      page = 1,
      limit = 12,
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (genderPreference) filter.genderPreference = genderPreference;
    if (roomType) filter.roomType = roomType;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filter.amenities = { $all: amenitiesArray };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const pgs = await PG.find(filter)
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count
    const total = await PG.countDocuments(filter);

    res.json({
      pgs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get PGs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pg/:id
// @desc    Get single PG listing
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id)
      .populate('owner', 'name email phone city')
      .populate('inquiries.user', 'name email');

    if (!pg) {
      return res.status(404).json({ message: 'PG listing not found' });
    }

    // Increment views
    await pg.incrementViews();

    res.json({ pg });
  } catch (error) {
    console.error('Get PG error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/pg/:id
// @desc    Update PG listing
// @access  Private (Owner only)
router.put('/:id', auth, authorize('owner'), uploadMultiple, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().isLength({ min: 10 }),
  body('rent').optional().isNumeric(),
  body('capacity').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: 'PG listing not found' });
    }

    // Check ownership
    if (pg.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updateData = { ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      // Delete old images from cloudinary
      if (pg.images.length > 0) {
        for (const image of pg.images) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }

      updateData.images = req.files.map(file => ({
        url: file.secure_url,      // Cloudinary's image URL
        publicId: file.public_id  
      }));
    }

    const updatedPg = await PG.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      message: 'PG listing updated successfully',
      pg: updatedPg
    });
  } catch (error) {
    console.error('Update PG error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   DELETE /api/pg/:id
// @desc    Delete PG listing
// @access  Private (Owner only)
router.delete('/:id', auth, authorize('owner'), async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: 'PG listing not found' });
    }

    // Check ownership
    if (pg.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    // Delete images from cloudinary
    if (pg.images.length > 0) {
      for (const image of pg.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await PG.findByIdAndDelete(req.params.id);

    res.json({ message: 'PG listing deleted successfully' });
  } catch (error) {
    console.error('Delete PG error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pg/owner/my-listings
// @desc    Get owner's PG listings
// @access  Private (Owner only)
router.get('/owner/my-listings', auth, authorize('owner'), async (req, res) => {
  try {
    const pgs = await PG.find({ owner: req.user._id })
      .populate('inquiries.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ pgs });
  } catch (error) {
    console.error('Get owner listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pg/:id/inquiry
// @desc    Send inquiry for a PG
// @access  Private (Client only)
router.post('/:id/inquiry', auth, authorize('client'), [
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
  body('contactNumber').isLength({ min: 10 }).withMessage('Contact number must be at least 10 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: 'PG listing not found' });
    }

    const { message, contactNumber } = req.body;

    console.log("Inquiry request body:", req.body);

await pg.addInquiry(req.user._id, message.trim(), contactNumber.trim());


    res.json({ message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Send inquiry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pg/cities
// @desc    Get all available cities
// @access  Public
router.get('/cities', async (req, res) => {
  try {
    const cities = await PG.distinct('address.city');
    res.json({ cities: cities.sort() });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;