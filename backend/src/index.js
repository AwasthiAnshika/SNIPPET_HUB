require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// Request logging middleware
app.use(requestLogger);

app.use('/api', routes);

// Error logging middleware
app.use(errorLogger);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/code_snippets');
  console.log('✅ MongoDB connected');
  
  // Ensure indexes are created
  try {
    await require('./models/Snippet').syncIndexes();
    await require('./models/User').syncIndexes();
    await require('./models/Favorite').syncIndexes();
    await require('./models/Rating').syncIndexes();
    console.log('✅ Indexes synchronized');
  } catch (err) {
    console.warn('⚠️  Warning: Could not sync indexes:', err.message);
  }
  
  app.listen(PORT, ()=> console.log('🚀 Server started on port', PORT));
}

if (require.main === module) {
  start().catch(err=>{
    console.error(err);
    process.exit(1);
  });
}

module.exports = app;
