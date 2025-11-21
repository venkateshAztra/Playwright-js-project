// utils/generateEmail.js

function generateRandomEmail() {
    const now = new Date();
  
    // Format date and time as YYYYMMDD_HHMMSS
    const timestamp = now
      .toISOString()
      .replace(/[-:T]/g, '')
      .split('.')[0]; // e.g., "20250507_134501"
  
    const email = `user_${timestamp}@example.com`;
    return email;
  }
  
  module.exports = { generateRandomEmail };
  