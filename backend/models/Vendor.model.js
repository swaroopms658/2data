const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Software', 'Cloud', 'SaaS', 'Hardware', 'Other'],
        default: 'Software'
    },
    contact: {
        email: String,
        phone: String,
        website: String
    },
    accountManager: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', vendorSchema);
