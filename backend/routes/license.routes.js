const express = require('express');
const router = express.Router();
const License = require('../models/License.model');

// GET all licenses
router.get('/', async (req, res) => {
    try {
        const { vendor, status } = req.query;
        const filter = {};

        if (vendor) filter.vendor = vendor;
        if (status) filter.status = status;

        const licenses = await License.find(filter).sort({ createdAt: -1 });
        res.json(licenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET license by ID
router.get('/:id', async (req, res) => {
    try {
        const license = await License.findById(req.params.id);
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        res.json(license);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET licenses by vendor
router.get('/vendor/:vendor', async (req, res) => {
    try {
        const licenses = await License.find({ vendor: req.params.vendor });
        res.json(licenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new license
router.post('/', async (req, res) => {
    try {
        const license = new License(req.body);
        await license.save();
        res.status(201).json(license);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update license
router.put('/:id', async (req, res) => {
    try {
        const license = await License.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        res.json(license);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE license
router.delete('/:id', async (req, res) => {
    try {
        const license = await License.findByIdAndDelete(req.params.id);
        if (!license) {
            return res.status(404).json({ error: 'License not found' });
        }
        res.json({ message: 'License deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
