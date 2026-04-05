require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiLogger = require('./middleware/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLogger);

app.get('/', (req, res) => {
  res.send("API Running");
});

app.use('/api/auth', require('./routes/authRoutes'));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
