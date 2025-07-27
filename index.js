require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());

// Add CORS middleware BEFORE other middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080','http://localhost:8081','http://localhost:8082');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


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


