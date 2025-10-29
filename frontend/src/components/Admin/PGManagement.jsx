// src/components/Admin/PGManagement.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const PGManagement = () => {
  const queryClient = useQueryClient();

  const { data: pgs, isLoading } = useQuery("admin-pgs", adminService.getPGs, {
    onError: (err) => toast.error(err.message || "Failed to load PGs")
  });

  const deleteMutation = useMutation((id) => adminService.deletePG(id), {
    onSuccess: () => {
      toast.success("PG deleted");
      queryClient.invalidateQueries("admin-pgs");
      queryClient.invalidateQueries("admin-dashboard");
    },
    onError: (err) => toast.error(err.message || "Failed to delete PG")
  });

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">PG Management</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!pgs || pgs.length === 0 ? (
              <tr>
                <td className="px-6 py-4" colSpan={4}>No PG listings found.</td>
              </tr>
            ) : (
              pgs.map(pg => (
                <tr key={pg._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pg.name}</div>
                    <div className="text-xs text-gray-500">{pg.address?.city || "—"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{pg.owner?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{pg.owner?.email || "—"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{pg.views ?? 0}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center space-x-2">
                      {/* Edit can be added later */}
                      <button
                        onClick={() => handleDelete(pg._id, pg.name)}
                        className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PGManagement;
