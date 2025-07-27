require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');


app.use(express.json());

// Add CORS middleware BEFORE other middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'https://cleaningbackend-production.up.railway.app' // Production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Test route
app.get('/', (req, res) => {
  res.send('Cleaning Backend is Live!');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);



const clientRoutes = require("./routes/clientRoutes");
app.use("/api/client", clientRoutes);

const cleanerRoutes = require("./routes/cleanerRoutes");
app.use("/api/cleaner", cleanerRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


