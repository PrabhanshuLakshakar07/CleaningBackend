require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());

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


