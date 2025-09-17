require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const workflowRoutes = require('./routes/workflow');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const fs = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', '..', UPLOAD_DIR)));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => {
  console.error('DB sync error', err);
});
