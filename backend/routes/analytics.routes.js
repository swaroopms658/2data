const express = require('express');
const router = express.Router();
const License = require('../models/License.model');

// GET cost summary
router.get('/cost-summary', async (req, res) => {
    try {
        const licenses = await License.find({ status: 'active' });

        const totalCost = licenses.reduce((sum, lic) => sum + lic.cost, 0);
        const totalLicenses = licenses.length;
        const avgUtilization = licenses.reduce((sum, lic) => sum + lic.usage, 0) / totalLicenses;

        // Calculate potential savings (licenses with usage < 50%)
        const underutilized = licenses.filter(lic => lic.usage < 50);
        const potentialSavings = underutilized.reduce((sum, lic) => sum + (lic.cost * 0.3), 0);

        res.json({
            totalCost,
            totalLicenses,
            avgUtilization: Math.round(avgUtilization),
            potentialSavings: Math.round(potentialSavings)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET usage trends
router.get('/usage-trends', async (req, res) => {
    try {
        const licenses = await License.find();

        // Group by vendor
        const vendorStats = {};
        licenses.forEach(lic => {
            if (!vendorStats[lic.vendor]) {
                vendorStats[lic.vendor] = {
                    count: 0,
                    totalCost: 0,
                    avgUsage: 0,
                    licenses: []
                };
            }
            vendorStats[lic.vendor].count++;
            vendorStats[lic.vendor].totalCost += lic.cost;
            vendorStats[lic.vendor].licenses.push(lic.usage);
        });

        // Calculate averages
        Object.keys(vendorStats).forEach(vendor => {
            const stats = vendorStats[vendor];
            stats.avgUsage = Math.round(
                stats.licenses.reduce((a, b) => a + b, 0) / stats.licenses.length
            );
            delete stats.licenses;
        });

        res.json(vendorStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET vendor comparison
router.get('/vendor-comparison', async (req, res) => {
    try {
        const licenses = await License.find();

        const comparison = licenses.reduce((acc, lic) => {
            if (!acc[lic.vendor]) {
                acc[lic.vendor] = {
                    vendor: lic.vendor,
                    totalLicenses: 0,
                    totalCost: 0,
                    avgUtilization: 0,
                    usageSum: 0
                };
            }
            acc[lic.vendor].totalLicenses++;
            acc[lic.vendor].totalCost += lic.cost;
            acc[lic.vendor].usageSum += lic.usage;
            return acc;
        }, {});

        // Calculate averages
        Object.values(comparison).forEach(vendor => {
            vendor.avgUtilization = Math.round(vendor.usageSum / vendor.totalLicenses);
            delete vendor.usageSum;
        });

        res.json(Object.values(comparison));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET optimization opportunities
router.get('/optimization-opportunities', async (req, res) => {
    try {
        const licenses = await License.find();

        const opportunities = {
            underutilized: licenses.filter(lic => lic.usage < 50).length,
            expiringSoon: licenses.filter(lic => {
                const daysUntilRenewal = (new Date(lic.renewalDate) - new Date()) / (1000 * 60 * 60 * 24);
                return daysUntilRenewal < 30 && daysUntilRenewal > 0;
            }).length,
            inactive: licenses.filter(lic => lic.status === 'inactive').length,
            highCost: licenses.filter(lic => lic.cost > 10000).length
        };

        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
