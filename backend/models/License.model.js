const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    vendor: {
        type: String,
        required: true,
        enum: ['Microsoft', 'SAP', 'Oracle', 'Salesforce', 'IBM', 'Other']
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    renewalDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expiring', 'inactive', 'pending'],
        default: 'active'
    },
    usage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
licenseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('License', licenseSchema);
