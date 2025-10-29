import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api"; // ✅ shared axios instance
import { Trash2, Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "react-query";
import { toast } from "react-hot-toast";

import {
  Plus,
  Users,
  formatPrice,
  Heart,
  Search, 
  Filter, 
  MapPin, 
  Wifi, 
  Snowflake,
  Utensils,
  Car,
  Shield,
  Star,
  Eye
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  // ✅ query uses api instance (auto includes token)
  const { data: dashboardData, isLoading, error } = useQuery(
    "dashboard",
    async () => {
      const response = await api.get("/user/dashboard");
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
    
  );
   const getAmenityIcon = (amenity) => {
    const amenityItem = amenitiesList.find(a => a.key === amenity);
    return amenityItem ? amenityItem.icon : null;
  };
  const amenitiesList = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'ac', label: 'AC', icon: Snowflake },
    { key: 'food', label: 'Food', icon: Utensils },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'security', label: 'Security', icon: Shield }
  ];
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const queryClient = useQueryClient();

const deletePGMutation = useMutation(
  async (id) => {
    const res = await api.delete(`/pg/${id}`); // your api instance adds /api base
    return res.data;
  },
  {
    onSuccess: () => {
      toast.success('Listing deleted');
      // Simplest: refetch dashboard so counts & lists are fresh
      queryClient.invalidateQueries('dashboard');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Failed to delete listing';
      toast.error(msg);
    },
  }
);
const handleDelete = (e, id) => {
  e.preventDefault(); // because the card is a Link
  e.stopPropagation();
  if (!window.confirm('Delete this listing? This cannot be undone.')) return;
  deletePGMutation.mutate(id);
};


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.role === "owner";
  const data = dashboardData?.dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {isOwner
              ? "Manage your PG listings and track inquiries"
              : "Track your favorite PGs and recent searches"}
          </p>
        </div>

        {/* ✅ Owner Dashboard */}
        {isOwner && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Total Listings</h3>
                  <p className="text-2xl font-bold">{data?.totalListings || 0}</p>
                </div>
                <Plus className="h-8 w-8 text-indigo-600" />
              </div>

              <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Total Inquiries</h3>
                  <p className="text-2xl font-bold">{data?.totalInquiries || 0}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Total Views</h3>
                  <p className="text-2xl font-bold">{data?.totalViews || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {/* Owner's PG Listings */}
<div className="bg-white rounded-lg shadow p-6 mb-8">
  <h2 className="text-xl font-bold mb-4">My PG Listings</h2>

  {data?.recentListings?.length > 0 ? (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.recentListings.map((pg) => (

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
             {/* Delete button (owner-only) */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, pg._id)}
                  disabled={deletePGMutation.isLoading}
                  title="Delete listing"
                  className="bg-white rounded-full p-2 shadow-sm hover:bg-red-50"
                >
                  {deletePGMutation.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-600" />
                  )}
                </button>
              </div>
 
            
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {pg.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2 flex items-center">
              <MapPin size={14} className="mr-1" />
              {pg.address?.city}, {pg.address?.state}
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

            {/* Price and Views */}
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
  ) : (
    <p className="text-gray-500">You haven’t listed any PGs yet.</p>
  )}
</div>


            {/* Recent Inquiries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>
              <ul>
                {data?.recentInquiries?.length > 0 ? (
                  data.recentInquiries.map((inq, i) => (
                    <li key={i} className="border-b py-2">
                      <span className="font-medium">{inq.user?.name}</span> asked
                      about{" "}
                      <Link
                            to={`/pg/${inq.pgId}`}
                            className="text-indigo-600 hover:underline"
                       >  
                            {inq.pgName}
                          </Link>{" "}
                          on {formatDate(inq.createdAt)}
                          <p className="text-gray-600 mt-1">"{inq.message}"</p> {/* ✅ Show message */}
                      </li>

                  ))
                ) : (
                  <p className="text-gray-500">No recent inquiries.</p>
                )}
              </ul>
            </div>
          </>
        )}

        {/* ✅ Client Dashboard */}
        {!isOwner && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
            <ul>
              {data?.recentFavorites?.length > 0 ? (
                data.recentFavorites.map((pg) => (
                  <li key={pg._id} className="border-b py-2">
                    <Link
                      to={`/pg/${pg._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {pg.name}
                    </Link>{" "}
                    - {pg.city}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No favorite PGs yet.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
