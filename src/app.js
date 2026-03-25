const express = require('express');
const path = require('path');
const app = express();
const predictRoutes = require('./routes/predict.routes');

// Serve the minimal demo UI (single page) from /public.
// Mount under "/demo" so the existing GET "/" health check stays unchanged.
app.use('/demo', express.static(path.join(__dirname, '../public')));

// Register prediction-related routes under /api
app.use('/api', predictRoutes);

// Simple check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'RealVision API running'
    });
});

module.exports = app;
