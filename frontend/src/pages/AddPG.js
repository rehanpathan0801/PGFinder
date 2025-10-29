import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import api from '../api';
import { 
  Home, 
  MapPin, 
  Users, 
  Wifi, 
  Snowflake,
  Utensils,
  Car,
  Shield,
  Dumbbell,
  Tv,
  Bed,
  Bath,
  Building,
  TreePine,
  Zap,
  Sparkles,
  Upload,
  X,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const AddPG = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    genderPreference: '',
    roomType: '',
    rent: '',
    deposit: '',
    capacity: '',
    contactNumber: '',
    contactEmail: '',
    amenities: [],
    rules: [''],
    nearbyPlaces: [{ name: '', distance: '', type: '' }]
  });

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

  const genderOptions = [
    { value: 'boys', label: 'Boys Only' },
    { value: 'girls', label: 'Girls Only' },
    { value: 'co-ed', label: 'Co-ed' }
  ];

  const roomTypeOptions = [
    { value: 'shared', label: 'Shared Room' },
    { value: 'single', label: 'Single Room' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
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

  const createPGMutation = useMutation(
    async (formData) => {
      const data = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'amenities' || key === 'rules' || key === 'nearbyPlaces') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach((image, index) => {
        data.append('images', image.file);
      });

      const response = await api.post('/pg', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('PG listing created successfully!');
        queryClient.invalidateQueries(['pgs']);
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create PG listing');
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty rules and nearby places
      const filteredData = {
        ...formData,
        rules: formData.rules.filter(rule => rule.trim() !== ''),
        nearbyPlaces: formData.nearbyPlaces.filter(place => 
          place.name.trim() !== '' && place.distance.trim() !== '' && place.type.trim() !== ''
        )
      };

      await createPGMutation.mutateAsync(filteredData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New PG Listing
          </h1>
          <p className="text-gray-600">
            Create a detailed listing for your PG accommodation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  PG Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-field"
                  placeholder="Enter PG name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  required
                  className="input-field"
                  placeholder="Enter contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  required
                  className="input-field"
                  placeholder="Enter contact email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Capacity *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  required
                  min="1"
                  className="input-field"
                  placeholder="Number of rooms/beds"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="input-field resize-none"
                placeholder="Describe your PG accommodation, facilities, and what makes it special..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Address */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  required
                  className="input-field"
                  placeholder="Enter street address"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="address.city"
                  required
                  className="input-field"
                  placeholder="Enter city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="address.state"
                  required
                  className="input-field"
                  placeholder="Enter state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="address.pincode"
                  required
                  className="input-field"
                  placeholder="Enter pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Pricing and Preferences */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Pricing and Preferences
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  required
                  min="0"
                  className="input-field"
                  placeholder="Enter monthly rent"
                  value={formData.rent}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  id="deposit"
                  name="deposit"
                  min="0"
                  className="input-field"
                  placeholder="Enter security deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="genderPreference" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference *
                </label>
                <select
                  id="genderPreference"
                  name="genderPreference"
                  required
                  className="input-field"
                  value={formData.genderPreference}
                  onChange={handleChange}
                >
                  <option value="">Select gender preference</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  required
                  className="input-field"
                  value={formData.roomType}
                  onChange={handleChange}
                >
                  <option value="">Select room type</option>
                  {roomTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (Max 10)
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

            {images.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Create PG Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPG; 