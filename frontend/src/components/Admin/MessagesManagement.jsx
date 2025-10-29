// src/components/Admin/MessagesManagement.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const MessagesManagement = () => {
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages, isLoading } = useQuery(
    "admin-messages",
    adminService.getMessages,
    {
      onError: (err) => toast.error(err.message || "Failed to load messages"),
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => adminService.deleteMessage(id),
    {
      onSuccess: () => {
        toast.success("Message deleted");
        queryClient.invalidateQueries("admin-messages");
        setSelected(null); // clear preview if deleted
      },
      onError: (err) => toast.error(err.message || "Failed to delete message"),
    }
  );

  const handleDelete = (msg) => {
    if (!window.confirm(`Delete message from "${msg.name}"?`)) return;
    deleteMutation.mutate(msg._id);
  };

  if (isLoading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox List */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-semibold mb-3">Inbox</h2>

          {(!messages || messages.length === 0) ? (
            <p className="text-gray-600">No messages found.</p>
          ) : (
            <ul className="divide-y">
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className={`p-3 cursor-pointer ${
                    selected && selected._id === msg._id
                      ? "bg-primary-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelected(msg)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{msg.name}</div>
                      <div className="text-xs text-gray-500">{msg.email}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 truncate">
                    {msg.message}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Message Preview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-semibold mb-3">Message Preview</h2>

          {!selected ? (
            <div className="text-gray-600">
              Select a message to view details
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <div className="text-lg font-bold">{selected.name}</div>
                <div className="text-sm text-gray-500">{selected.email}</div>
                <div className="text-xs text-gray-400">
                  {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="whitespace-pre-wrap text-gray-800">
                {selected.message}
              </div>

              <div className="mt-6 space-x-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="btn-primary inline-block"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManagement;
