const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/auth");

// GET /api/dashboard/kpis - Retorna KPIs do dashboard
router.get("/kpis", verifyToken, controller.getKPIs);

module.exports = router;
