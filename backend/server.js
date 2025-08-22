const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const transferRoutes = require('./routes/transferRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://kristalball-frontend.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Trust proxy for getting real IP addresses
app.set('trust proxy', true);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'API OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/assets', 
      '/api/transfers',
      '/api/purchases',
      '/api/assignments'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with database connection
const startServer = async () => {
  try {
    // Try to connect to MongoDB
    const dbConnection = await connectDB();
    
    // Helper to start listening on a given port
    const listenOn = (port) => new Promise((resolve, reject) => {
      const server = app.listen(port, () => resolve({ server, port }));
      server.on('error', reject);
    });

    // Start the Express server with fallback
    let activePort = DEFAULT_PORT;
    try {
      const { port } = await listenOn(DEFAULT_PORT);
      activePort = port;
    } catch (err) {
      if (err?.code === 'EADDRINUSE') {
        // Try next available port
        for (let p = DEFAULT_PORT + 1; p <= DEFAULT_PORT + 10; p++) {
          try {
            const { port } = await listenOn(p);
            activePort = port;
            break;
          } catch (e) {
            if (e?.code !== 'EADDRINUSE') throw e;
          }
        }
      } else {
        throw err;
      }
    }

    console.log(`🚀 Military Asset Management Server running on port ${activePort}`);
    console.log(`📊 API Documentation available at http://localhost:${activePort}/health`);
      
    if (dbConnection) {
      console.log(`🔗 MongoDB connection status: Connected`);
      console.log(`📝 To seed database with demo data, run: node seedData.js`);
    } else {
      console.log(`⚠️  MongoDB connection status: Not connected (using fallback storage)`);
      console.log(`📝 Set up MongoDB Atlas and update .env file for persistent storage`);
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;