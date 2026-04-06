require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const chefRoutes = require('./routes/chefRoutes');   
const uploadRoutes = require('./routes/uploadRoutes');   
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/chefs', chefRoutes);      
app.use('/api/upload', uploadRoutes);


app.get('/', (req, res) => {
  res.send('RecipeNest API is running! 🍳');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});