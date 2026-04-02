const express = require('express');
const mongoose = require('mongoose');
const volunteerRoutes = require('./routes/volunteerRoutes');
const callRoutes = require('./routes/callRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://127.0.0.1:27017/friendlyHelp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/volunteers', volunteerRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
