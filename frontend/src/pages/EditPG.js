import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  Save,
  Upload,
  X,
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
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Heart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    genderPreference: 'any',
    available: true,
    rent: '',
    deposit: '',
    roomType: 'single',
    contactNumber: '',
    description: '',
    amenities: [],
    rules: [''],
    nearbyPlaces: [{ name: '', distance: '', type: '' }]
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const amenitiesList = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'ac', label: 'AC', icon: Snowflake },
    { key: 'tv', label: 'TV', icon: Tv },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'food', label: 'Food', icon: Utensils },
    { key: 'gym', label: 'Gym', icon: Dumbbell },
    { key: 'laundry', label: 'Laundry', icon: RotateCcw },
    { key: 'attached_bathroom', label: 'Attached Bathroom', icon: Droplets },
    { key: 'furnished', label: 'Furnished', icon: Bed }
  ];

  const roomTypeOptions = [
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Sharing' },
    { value: 'triple', label: 'Triple Sharing' },
    { value: 'dormitory', label: 'Dormitory' }
  ];

  // Fetch PG data
  const { data: pgData, isLoading, error } = useQuery(
    ['pg', id],
    async () => {
      const response = await fetch(`/api/pg/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PG data');
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setFormData({
          name: data.name || '',
          address: data.address || '',
          city: data.city || '',
          genderPreference: data.genderPreference || 'any',
          available: data.available !== undefined ? data.available : true,
          rent: data.rent || '',
          deposit: data.deposit || '',
          roomType: data.roomType || 'single',
          contactNumber: data.contactNumber || '',
          description: data.description || '',
          amenities: data.amenities || [],
          rules: data.rules && data.rules.length > 0 ? data.rules : [''],
          nearbyPlaces: data.nearbyPlaces && data.nearbyPlaces.length > 0 
            ? data.nearbyPlaces 
            : [{ name: '', distance: '', type: '' }]
        });
        setImages(data.images || []);
      }
    }
  );

  // Update PG mutation
  const updatePGMutation = useMutation(
    async (formData) => {
      const formDataToSend = new FormData();
      
      // Add basic fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities' || key === 'rules' || key === 'nearbyPlaces') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add new images
      newImages.forEach(image => {
        formDataToSend.append('images', image.file);
      });

      // Add removed image IDs
      if (removedImages.length > 0) {
        formDataToSend.append('removedImages', JSON.stringify(removedImages));
      }

      const response = await fetch(`/api/pg/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update PG');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('PG listing updated successfully!');
        queryClient.invalidateQueries(['pg', id]);
        queryClient.invalidateQueries('my-pgs');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update PG listing');
      }
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    if (newImages.length + validFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newImageFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
  };

  const removeExistingImage = (imageId) => {
    setRemovedImages(prev => [...prev, imageId]);
    setImages(prev => prev.filter(img => img._id !== imageId));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRule = (index, value) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const addNearbyPlace = () => {
    setFormData(prev => ({
      ...prev,
      nearbyPlaces: [...prev.nearbyPlaces, { name: '', distance: '', type: '' }]
    }));
  };

  const removeNearbyPlace = (index) => {
    setFormData(prev => ({
      ...prev,
      nearbyPlaces: prev.nearbyPlaces.filter((_, i) => i !== index)
    }));
  };

  const updateNearbyPlace = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      nearbyPlaces: prev.nearbyPlaces.map((place, i) => 
        i === index ? { ...place, [field]: value } : place
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('PG name is required');
      return;
    }

    if (!formData.address.trim()) {
      toast.error('Address is required');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('City is required');
      return;
    }

    if (!formData.rent || formData.rent <= 0) {
      toast.error('Valid rent amount is required');
      return;
    }

    if (!formData.contactNumber.trim()) {
      toast.error('Contact number is required');
      return;
    }

    // Filter out empty rules and nearby places
    const filteredRules = formData.rules.filter(rule => rule.trim() !== '');
    const filteredNearbyPlaces = formData.nearbyPlaces.filter(
      place => place.name.trim() !== '' && place.distance.trim() !== ''
    );

    const submitData = {
      ...formData,
      rules: filteredRules,
      nearbyPlaces: filteredNearbyPlaces
    };

    updatePGMutation.mutate(submitData);
  };

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
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!pgData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PG Not Found</h2>
          <p className="text-gray-600 mb-4">The PG listing you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const loading = updatePGMutation.isLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit PG Listing</h1>
          <p className="text-gray-600 mt-2">Update your PG listing information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PG Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter PG name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your PG, facilities, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Availability */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Availability</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter monthly rent"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter security deposit"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="input-field"
                >
                  {roomTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference
                </label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="any">Any Gender</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Currently Available
                </label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {amenitiesList.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.key)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{amenity.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
            
            {/* Existing Images */}
            {images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Images</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image._id} className="relative">
                      <img
                        src={image.url}
                        alt="PG Image"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image._id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Images (Max 10 total)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium"
                >
                  Click to upload images
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, JPEG up to 5MB each
                </p>
              </div>
            </div>

            {newImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">New Images</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rules */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">House Rules</h2>
            <div className="space-y-4">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter house rule"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRule}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Rule
              </button>
            </div>
          </div>

          {/* Nearby Places */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Nearby Places</h2>
            <div className="space-y-4">
              {formData.nearbyPlaces.map((place, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={place.name}
                    onChange={(e) => updateNearbyPlace(index, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Place name"
                  />
                  <input
                    type="text"
                    value={place.distance}
                    onChange={(e) => updateNearbyPlace(index, 'distance', e.target.value)}
                    className="input-field"
                    placeholder="Distance"
                  />
                  <input
                    type="text"
                    value={place.type}
                    onChange={(e) => updateNearbyPlace(index, 'type', e.target.value)}
                    className="input-field"
                    placeholder="Type (e.g., Metro, Mall)"
                  />
                  <button
                    type="button"
                    onClick={() => removeNearbyPlace(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addNearbyPlace}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Nearby Place
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update PG Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPG; 