# RealVision Deepfake Detection Backend

Backend API for the RealVision project. This service is being built to support video upload and future prediction of whether a video is real or fake using a deep learning model.

## Current Stack
- Node.js
- Express.js
- Multer

## Current Endpoints
- `GET /` - API health check
- `POST /api/predict` - upload a video file with basic validation and return uploaded file details

## Run Locally
```bash
npm install
node src/server.js

## Current Functionality
- Express backend setup
- REST API structure
- Video upload endpoint with Multer
- Temporary file storage in `uploads/`
- File type validation (video only)
- File size limit (50MB)

## Planned Improvements
- Integration with Python inference pipeline
- Temporary file cleanup after processing
- Return prediction result and confidence score```bash

