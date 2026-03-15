const express = require('express');
const app = express();
const predictRoutes = require('./routes/predict.routes');
app.use('/api', predictRoutes);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'RealVision API running'
    });
});

module.exports = app;
