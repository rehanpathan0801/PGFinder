import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Wifi, 
  Snowflake,
  Utensils,
  Car,
  Shield,
  Star,
  Heart,
  Eye
} from 'lucide-react';

const PGList = () => {
  const [filters, setFilters] = useState({
    city: '',
    genderPreference: '',
    roomType: '',
    minRent: '',
    maxRent: '',
    amenities: [],
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const amenitiesList = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'ac', label: 'AC', icon: Snowflake },
    { key: 'food', label: 'Food', icon: Utensils },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'security', label: 'Security', icon: Shield }
  ];

  const genderOptions = [
    { value: '', label: 'All' },
    { value: 'boys', label: 'Boys Only' },
    { value: 'girls', label: 'Girls Only' },
    { value: 'co-ed', label: 'Co-ed' }
  ];

  const roomTypeOptions = [
    { value: '', label: 'All' },
    { value: 'shared', label: 'Shared' },
    { value: 'single', label: 'Single' }
  ];

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value);
        }
      }
    });
    params.append('page', currentPage);
    return params.toString();
  };

  // Fetch PGs
  const { data, isLoading, error, refetch } = useQuery(
    ['pgs', filters, currentPage],
    async () => {
      const queryString = buildQueryString();
      const response = await api.get(`/pg?${queryString}`);
      return response.data;
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch cities for dropdown
  const { data: citiesData } = useQuery(
    'cities',
    async () => {
      const response = await api.get('/pg/cities');
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      genderPreference: '',
      roomType: '',
      minRent: '',
      maxRent: '',
      amenities: [],
      search: ''
    });
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const amenityItem = amenitiesList.find(a => a.key === amenity);
    return amenityItem ? amenityItem.icon : null;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading PGs</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect PG
          </h1>
          <p className="text-gray-600">
            Discover comfortable and affordable Paying Guest accommodations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by PG name, location, or description..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Clear All
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  className="input-field"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  <option value="">All Cities</option>
                  {citiesData?.cities?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender Preference
                </label>
                <select
                  className="input-field"
                  value={filters.genderPreference}
                  onChange={(e) => handleFilterChange('genderPreference', e.target.value)}
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  className="input-field"
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                >
                  {roomTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field"
                    value={filters.minRent}
                    onChange={(e) => handleFilterChange('minRent', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field"
                    value={filters.maxRent}
                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = filters.amenities.includes(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    onClick={() => handleAmenityToggle(amenity.key)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm border transition-colors ${
                      isSelected
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{amenity.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : `${data?.pagination?.totalItems || 0} PGs found`}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : data?.pgs?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PGs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* PG Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.pgs?.map((pg) => (
                  <Link
                    key={pg._id}
                    to={`/pg/${pg._id}`}
                    className="card-hover group"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {pg.images && pg.images.length > 0 ? (
                        <img
                          src={pg.images[0].url}
                          alt={pg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <MapPin size={48} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                        <Heart size={16} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {pg.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {pg.address.city}, {pg.address.state}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        {pg.genderPreference} • {pg.roomType} room
                      </p>
                      
                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pg.amenities?.slice(0, 3).map((amenity) => {
                          const Icon = getAmenityIcon(amenity);
                          return Icon ? (
                            <div key={amenity} className="flex items-center text-xs text-gray-500">
                              <Icon size={12} className="mr-1" />
                              {amenity}
                            </div>
                          ) : null;
                        })}
                        {pg.amenities?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{pg.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-primary-600">
                          {formatPrice(pg.rent)}/month
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye size={14} className="mr-1" />
                          {pg.views || 0}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(data.pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.pagination.totalPages))}
                      disabled={currentPage === data.pagination.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PGList; 