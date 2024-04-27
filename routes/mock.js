const express = require('express');
const router = express.Router();
const mockingProducts = require('../mockingProducts');

// Endpoint para generar productos de manera simulada
router.get('/', (req, res) => {
    const mockProducts = mockingProducts.generateMockProducts();
    res.json(mockProducts);
});

module.exports = router;