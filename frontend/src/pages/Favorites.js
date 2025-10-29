import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart,
  MapPin,
  Users,
  Star,
  Eye,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterCity, setFilterCity] = useState('');

  // Fetch favorites
  const { data: favoritesResponse, isLoading, error } = useQuery(
    'favorites',
    async () => {
      const response = await fetch('/api/user/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      return response.json();
    },
    {
      enabled: !!user
    }
  );

  // Extract favorites array from response
  const favorites = favoritesResponse?.favorites || [];

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation(
    async (pgId) => {
      const response = await fetch(`/api/user/favorites/${pgId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove from favorites');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
        toast.success('Removed from favorites');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to remove from favorites');
      }
    }
  );

  // Filter and sort favorites
  const filteredFavorites = React.useMemo(() => {
    if (!favorites) return [];

    let filtered = favorites.filter(pg => {
      const matchesSearch = pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pg.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pg.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !filterCity || pg.city.toLowerCase() === filterCity.toLowerCase();
      
      return matchesSearch && matchesCity;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.rent - b.rent);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.rent - a.rent);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [favorites, searchTerm, filterCity, sortBy]);

  // Get unique cities for filter
  const cities = React.useMemo(() => {
    if (!favorites) return [];
    return [...new Set(favorites.map(pg => pg.city))].sort();
  }, [favorites]);

  const handleRemoveFavorite = (pgId) => {
    removeFavoriteMutation.mutate(pgId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookmarkPlus size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">Please login to view your favorites</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-2">
                {favorites?.length || 0} saved PG listings
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <div>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date Added</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCity('');
                setSortBy('date');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            {favorites?.length === 0 ? (
              <>
                <Bookmark size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring PG listings and save your favorites for easy access.
                </p>
                <button
                  onClick={() => navigate('/pg-list')}
                  className="btn-primary"
                >
                  Browse PG Listings
                </button>
              </>
            ) : (
              <>
                <Search size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCity('');
                    setSortBy('date');
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredFavorites.map((pg) => (
              <div
                key={pg._id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                  <img
                    src={pg.images?.[0]?.url || '/placeholder-pg.jpg'}
                    alt={pg.name}
                    className={`w-full object-cover ${
                      viewMode === 'list' ? 'h-32' : 'h-48'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {pg.name}
                    </h3>
                    <button
                      onClick={() => handleRemoveFavorite(pg._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600 mb-2">
                    <MapPin size={14} />
                    <span className="text-sm">{pg.city}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{pg.genderPreference === 'any' ? 'Any' : pg.genderPreference}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{pg.views || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-primary-600">₹{pg.rent}</div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/pg/${pg._id}`)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Amenities Preview */}
                  {pg.amenities && pg.amenities.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {pg.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {pg.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{pg.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredFavorites.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredFavorites.length} of {favorites?.length || 0} favorites
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 