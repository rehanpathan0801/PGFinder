// src/components/Admin/Dashboard.jsx
import React from "react";
import { useQuery } from "react-query";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

import UsersManagement from "./UsersManagement";
import PGManagement from "./PGManagement";
import MessagesManagement from "./MessagesManagement";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery(
    "admin-dashboard",
    adminService.getDashboard,
    {
      onError: (err) => {
        toast.error(err.message || "Failed to load dashboard");
      },
    }
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-white rounded-md"></div>
          <div className="h-40 bg-white rounded-md"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <div className="p-6">Failed to load dashboard.</div>;
  }

  const { totalPGs, totalUsers, totalMessages, topPGs } = data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total PG Listings" value={totalPGs ?? 0} />
        <StatCard title="Total Users" value={totalUsers ?? 0} />
        <StatCard title="Total Messages" value={totalMessages ?? 0} />
      </div>

      {/* Top Viewed PGs */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top Viewed PGs</h2>
        {topPGs && topPGs.length > 0 ? (
          <ul className="space-y-2">
            {topPGs.map((pg) => (
              <li
                key={pg._id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <div className="font-medium">{pg.name}</div>
                  <div className="text-sm text-gray-500">
                    {pg.address?.city || "—"}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{pg.views ?? 0} views</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No PGs available</p>
        )}
      </div>

      {/* Show super-admin management sections */}
      {user?.role === "admin" && (
        <div className="space-y-6">
          <UsersManagement />
          <PGManagement />
          <MessagesManagement />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
