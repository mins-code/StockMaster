import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRouter);

// Start the server
const startServer = async () => {
  try {
    console.log('Starting server...');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1); // Exit the process with failure
  }
};

startServer();