const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth"); // reuse existing
const adminController = require("../controllers/AdminController");


// Protect all routes: auth + admin role
router.use(auth);
router.use(authorize("admin"));

// Dashboard stats
router.get("/dashboard", adminController.getDashboard);

// PG management
router.get("/pgs", adminController.getAllPGs);
// routes/admin.js
router.delete('/pgs/:id', auth, authorize('admin', 'super-admin'), adminController.deletePG);


// User management
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/block", adminController.toggleBlockUser);

// Messages
router.get("/messages", adminController.getAllMessages);

module.exports = router;
