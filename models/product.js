const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    // Add other product properties as needed
});

module.exports = mongoose.model('Product', productSchema);
