// Mock database connection - uses hardcoded data instead of MongoDB
import { mockDB } from '../mockData.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('✓ Using mock database (hardcoded data)');
    return mockDB;
  }

  try {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    isConnected = true;
    console.log('✓ Mock database initialized successfully (no MongoDB required)');
    return mockDB;
  } catch (err) {
    console.error('✗ Failed to initialize mock database:', err.message);
    throw new Error(`Failed to initialize mock database: ${err.message}`);
  }
};

