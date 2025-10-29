const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  genderPreference: {
    type: String,
    enum: ['boys', 'girls', 'co-ed'],
    required: true
  },
  roomType: {
    type: String,
    enum: ['shared', 'single'],
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'ac', 'food', 'laundry', 'parking', 'security', 
      'gym', 'tv', 'furnished', 'attached_bathroom', 'kitchen',
      'balcony', 'garden', 'power_backup', 'cleaning'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  contactNumber: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    enum: ['available', 'occupied', 'coming_soon'],
    default: 'available'
  },
  capacity: {
    type: Number,
    required: true
  },
  occupied: {
    type: Number,
    default: 0
  },
  rules: [{
    type: String
  }],
  nearbyPlaces: [{
    name: String,
    distance: String,
    type: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    contactNumber: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for location-based queries
pgSchema.index({ location: '2dsphere' });

// Index for search queries
pgSchema.index({ 
  name: 'text', 
  description: 'text', 
  'address.city': 'text' 
});

// Virtual for available rooms
pgSchema.virtual('availableRooms').get(function() {
  return this.capacity - this.occupied;
});

// Method to increment views
pgSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add inquiry
// Method to add inquiry
pgSchema.methods.addInquiry = function(userId, message, contactNumber) {
  if (!message || message.trim().length < 10) {
    throw new Error('Message must be at least 10 characters long');
  }
  if (!contactNumber || contactNumber.trim().length < 10) {
    throw new Error('Contact number must be at least 10 digits');
  }

  this.inquiries.push({
    user: userId,
    message: message.trim(),
    contactNumber: contactNumber.trim(),
    createdAt: new Date()
  });

  return this.save();
};


// Method to calculate average rating
pgSchema.methods.calculateAverageRating = function() {
  // This would be implemented when reviews are added
  return this.rating.average;
};

module.exports = mongoose.models.PG || mongoose.model('PG', pgSchema);
