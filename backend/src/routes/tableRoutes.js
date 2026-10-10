const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getAllTables);
router.get('/:tableNumber', tableController.getTableByNumber);
router.get('/:tableNumber/qr', tableController.generateTableQR);

module.exports = router;
