import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Heart,
  Eye,
  Wifi,
  Tv,
  Car,
  Utensils,
  Dumbbell,
  Snowflake,
  RotateCcw,
  Droplets,
  Bed,
  Users,
  Calendar,
  MessageCircle,
  Send,
  Shield,
  Bath,
  Building,
  TreePine,
  Zap,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkPlus,
  X
} from 'lucide-react';

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeImage, setActiveImage] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
    moveInDate: '',
    duration: ''
  });

  // Fetch PG details
  const { data: pgResponse, isLoading, error } = useQuery(
    ['pg', id],
    async () => {
      const response = await api.get(`/pg/${id}`);
      return response.data;
    }
  );

  // Extract pg object from response
  const pg = pgResponse?.pg;

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation(
    async () => {
      const response = await api.post(`/user/favorites/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pg', id]);
        queryClient.invalidateQueries('favorites');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update favorite');
      }
    }
  );

  // Submit inquiry mutation
  const submitInquiryMutation = useMutation(
    async (inquiryData) => {
      const response = await api.post(`/pg/${id}/inquiry`, inquiryData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Inquiry submitted successfully!');
        setShowInquiryForm(false);
        setInquiryData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          message: '',
          moveInDate: '',
          duration: ''
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to submit inquiry');
      }
    }
  );

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();

    if (!inquiryData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!inquiryData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!inquiryData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    if (!inquiryData.message.trim()) {
      toast.error('Message is required');
      return;
    }
    const payload = {
    contactNumber: inquiryData.phone,   // map phone → contactNumber
    message: inquiryData.message,
    name: inquiryData.name,
    email: inquiryData.email,
    moveInDate: inquiryData.moveInDate,
    duration: inquiryData.duration
  };

  submitInquiryMutation.mutate(payload);
};
   

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  const amenitiesList = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'ac', label: 'Air Conditioning', icon: Snowflake },
    { key: 'food', label: 'Food Included', icon: Utensils },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'gym', label: 'Gym', icon: Dumbbell },
    { key: 'tv', label: 'TV', icon: Tv },
    { key: 'furnished', label: 'Furnished', icon: Bed },
    { key: 'attached_bathroom', label: 'Attached Bathroom', icon: Bath },
    { key: 'kitchen', label: 'Kitchen', icon: Utensils },
    { key: 'balcony', label: 'Balcony', icon: Building },
    { key: 'garden', label: 'Garden', icon: TreePine },
    { key: 'power_backup', label: 'Power Backup', icon: Zap },
    { key: 'cleaning', label: 'Cleaning Service', icon: Sparkles }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/pg-list')}
            className="btn-primary"
          >
            Back to PG List
          </button>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PG Not Found</h2>
          <p className="text-gray-600 mb-4">The PG listing you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/pg-list')}
            className="btn-primary"
          >
            Back to PG List
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && pg && user._id === pg.owner?._id;
  const isFavorite = pg?.isFavorite;

  // Don't render if pg data is not loaded yet
  if (!pg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PG details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Share2 size={20} />
                <span>Share</span>
              </button>
              
              {user && !isOwner && (
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center space-x-2 ${
                    isFavorite ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isFavorite ? <Bookmark size={20} /> : <BookmarkPlus size={20} />}
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {pg.images && pg.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={pg.images[activeImage].url}
                    alt={pg.name}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {pg.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(prev => prev === 0 ? pg.images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setActiveImage(prev => prev === pg.images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {pg.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {pg.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === activeImage ? 'border-primary-500' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${pg.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{pg.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{pg.address?.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{pg.genderPreference === 'any' ? 'Any Gender' : `${pg.genderPreference} Only`}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">₹{pg.rent}</div>
                  <div className="text-sm text-gray-600">per month</div>
                  {pg.deposit && (
                    <div className="text-sm text-gray-600">+ ₹{pg.deposit} deposit</div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {pg.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {pg.amenities && pg.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity) => {
                    const Icon = amenity.icon;
                    const isAvailable = pg.amenities.includes(amenity.key);
                    return (
                      <div
                        key={amenity.key}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          isAvailable
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-400 border border-gray-200'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* House Rules */}
            {pg.rules && pg.rules.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h3>
                <ul className="space-y-2">
                  {pg.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nearby Places */}
            {pg.nearbyPlaces && pg.nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Places</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {pg.nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{place.name}</div>
                        <div className="text-sm text-gray-600">{place.type}</div>
                      </div>
                      <div className="text-sm text-gray-500">{place.distance}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <a href={`tel:${pg.contactNumber}`} className="text-primary-600 hover:text-primary-700">
                      {pg.contactNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <a href={`mailto:${pg.owner.email}`} className="text-primary-600 hover:text-primary-700">
                      {pg.owner.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-gray-700">
                      {pg.address?.street}, {pg.address?.city}, {pg.address?.state} - {pg.address?.pincode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <a
                  href={`tel:${pg.contactNumber}`}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
                
                <a
                  href={`mailto:${pg.owner.email}`}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Mail size={16} />
                  <span>Send Email</span>
                </a>

                {!isOwner && (
                  <button
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={16} />
                    <span>Send Inquiry</span>
                  </button>
                )}
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{pg.owner.name}</div>
                  <div className="text-sm text-gray-600">PG Owner</div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={16} />
                  <span>Listed {new Date(pg.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{pg.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                pg.availability === 'available'
                  ? 'bg-green-100 text-green-800'
                  : pg.availability === 'occupied'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {pg.availability === 'available' ? 'Available' : pg.availability === 'occupied' ? 'Occupied' : 'Coming Soon'}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={16} />
                  <span>Room Type: {pg.roomType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>Gender: {pg.genderPreference === 'any' ? 'Any' : pg.genderPreference}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Inquiry</h3>
              <button
                onClick={() => setShowInquiryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={inquiryData.name}
                  onChange={handleInquiryChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={inquiryData.email}
                  onChange={handleInquiryChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={inquiryData.phone}
                  onChange={handleInquiryChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Move-in Date
                </label>
                <input
                  type="date"
                  name="moveInDate"
                  value={inquiryData.moveInDate}
                  onChange={handleInquiryChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  name="duration"
                  value={inquiryData.duration}
                  onChange={handleInquiryChange}
                  className="input-field"
                >
                  <option value="">Select duration</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="1+ years">1+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={inquiryData.message}
                  onChange={handleInquiryChange}
                  rows={4}
                  className="input-field"
                  placeholder="Tell the owner about your requirements..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitInquiryMutation.isLoading}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {submitInquiryMutation.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGDetails; 