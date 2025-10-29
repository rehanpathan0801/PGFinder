// src/components/Admin/UsersManagement.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const UsersManagement = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery("admin-users", adminService.getUsers, {
    onError: (err) => toast.error(err.message || "Failed to load users"),
  });

  const toggleBlockMutation = useMutation((id) => adminService.toggleBlockUser(id), {
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries("admin-users");
    },
    onError: (err) => toast.error(err.message || "Failed to update user"),
  });

  const deleteMutation = useMutation((id) => adminService.deleteUser(id), {
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries("admin-users");
    },
    onError: (err) => toast.error(err.message || "Failed to delete user"),
  });

  const handleToggleBlock = (user) => {
    const confirmText = user.isBlocked ? `Unblock ${user.name}?` : `Block ${user.name}?`;
    if (!window.confirm(confirmText)) return;
    toggleBlockMutation.mutate(user._id);
  };

  const handleDeleteUser = (user) => {
    if (!window.confirm(`Delete ${user.name} permanently?`)) return;
    deleteMutation.mutate(user._id);
  };

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {!users || users.length === 0 ? (
              <tr>
                <td className="px-6 py-4" colSpan={4}>No users found.</td>
              </tr>
            ) : (
              users.map((u) => {
                const canManage = u.role?.toLowerCase() !== "admin" && u.role?.toLowerCase() !== "super-admin"; // Owner & user

                return (
                  <tr key={u._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{u.email}</div>
                      <div className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        {canManage ? (
                          <>
                            <button
                              onClick={() => handleToggleBlock(u)}
                              className={`px-3 py-1 rounded-md text-sm ${
                                u.isBlocked ? "bg-green-600 text-white" : "bg-yellow-500 text-white"
                              }`}
                            >
                              {u.isBlocked ? "Unblock" : "Block"}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
