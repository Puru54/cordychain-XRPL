const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://purugcit79:purugcit79@cluster0.s07xo5a.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
