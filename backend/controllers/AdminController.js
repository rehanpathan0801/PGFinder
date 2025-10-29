const User = require("../models/User");
const Pg = require("../models/PG");
const Message = require("../models/Message");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    const totalPGs = await Pg.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();

    // Top 5 most viewed PGs
    const topPGs = await Pg.find().sort({ views: -1 }).limit(5);

    res.json({
      totalPGs,
      totalUsers,
      totalMessages,
      topPGs,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all PG listings
// @route   GET /api/admin/pgs
// @access  Private/Admin
exports.getAllPGs = async (req, res) => {
  try {
    const pgs = await Pg.find().populate("owner", "name email phone city");
    res.json(pgs);
  } catch (err) {
    console.error("Get all PGs error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a PG listing
// @route   DELETE /api/admin/pgs/:id
// @access  Private/Admin
exports.deletePG = async (req, res) => {
  try {
    const pg = await Pg.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    await pg.deleteOne();
    res.json({ message: "PG deleted successfully" });
  } catch (err) {
    console.error("Delete PG error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Block or unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked
        ? "User has been blocked"
        : "User has been unblocked",
    });
  } catch (err) {
    console.error("Block user error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all contact messages
// @route   GET /api/admin/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
