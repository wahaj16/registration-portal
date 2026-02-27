const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://registration-portal-6zuq.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/exhibitors', require('./routes/exhibitors'));
app.use('/api/admin', require('./routes/admin'));

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
//   });
// }


// if (process.env.NODE_ENV === 'production') {
//   const buildPath = path.join(__dirname, '../client/build');

//   if (fs.existsSync(buildPath)) {
//     app.use(express.static(buildPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(buildPath, 'index.html'));
//     });
//   } else {
//     console.warn('⚠️ client/build not found. Skipping static serve.');
//   }
// }
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});