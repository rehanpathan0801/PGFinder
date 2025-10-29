// src/services/adminService.js
import api from "../api";

const adminService = {
  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },

  getPGs: async () => {
    const res = await api.get("/admin/pgs");
    return res.data;
  },

  deletePG: async (id) => {
    const res = await api.delete(`/admin/pgs/${id}`);
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get("/admin/users");
    return res.data;
  },

  deleteMessage: async (id) => {
  const res = await api.delete(`/admin/messages/${id}`);
  return res.data;
},

  toggleBlockUser: async (id) => {
    const res = await api.put(`/admin/users/${id}/block`);
    return res.data;
  },

  getMessages: async () => {
    const res = await api.get("/admin/messages");
    return res.data;
  }
};

export default adminService;
