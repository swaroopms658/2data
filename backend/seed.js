const mongoose = require('mongoose');
const License = require('./models/License.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/license-manager';

// Sample license data
const licenses = [
    { vendor: 'Microsoft', product: 'Microsoft 365 E5', quantity: 500, cost: 45000, renewalDate: new Date('2026-03-15'), status: 'active', usage: 92 },
    { vendor: 'SAP', product: 'SAP S/4HANA', quantity: 200, cost: 32000, renewalDate: new Date('2026-02-25'), status: 'active', usage: 78 },
    { vendor: 'Oracle', product: 'Oracle Database Enterprise', quantity: 150, cost: 24000, renewalDate: new Date('2026-02-10'), status: 'expiring', usage: 85 },
    { vendor: 'Salesforce', product: 'Sales Cloud', quantity: 300, cost: 15000, renewalDate: new Date('2026-04-20'), status: 'active', usage: 68 },
    { vendor: 'IBM', product: 'IBM Cloud Pak', quantity: 100, cost: 9000, renewalDate: new Date('2026-05-30'), status: 'active', usage: 45 },
    { vendor: 'Microsoft', product: 'Azure DevOps', quantity: 250, cost: 12500, renewalDate: new Date('2026-03-01'), status: 'active', usage: 88 },
    { vendor: 'Oracle', product: 'Oracle Cloud Infrastructure', quantity: 180, cost: 18000, renewalDate: new Date('2026-01-28'), status: 'expiring', usage: 72 },
    { vendor: 'Salesforce', product: 'Service Cloud', quantity: 200, cost: 10000, renewalDate: new Date('2026-06-15'), status: 'active', usage: 55 },
    { vendor: 'SAP', product: 'SAP Analytics Cloud', quantity: 120, cost: 8000, renewalDate: new Date('2026-02-05'), status: 'expiring', usage: 62 },
    { vendor: 'IBM', product: 'IBM Watson', quantity: 80, cost: 6000, renewalDate: new Date('2026-07-10'), status: 'active', usage: 38 },
    { vendor: 'Microsoft', product: 'Power BI Pro', quantity: 350, cost: 17500, renewalDate: new Date('2026-04-01'), status: 'active', usage: 75 },
    { vendor: 'Oracle', product: 'Oracle EPM Cloud', quantity: 100, cost: 15000, renewalDate: new Date('2026-03-20'), status: 'active', usage: 68 },
    { vendor: 'Salesforce', product: 'Marketing Cloud', quantity: 150, cost: 12000, renewalDate: new Date('2026-05-15'), status: 'active', usage: 58 },
    { vendor: 'SAP', product: 'SAP SuccessFactors', quantity: 180, cost: 14000, renewalDate: new Date('2026-04-10'), status: 'active', usage: 71 },
    { vendor: 'IBM', product: 'IBM Cognos Analytics', quantity: 75, cost: 8500, renewalDate: new Date('2026-06-01'), status: 'active', usage: 52 },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing licenses
        await License.deleteMany({});
        console.log('🗑️  Cleared existing licenses');

        // Insert sample data
        await License.insertMany(licenses);
        console.log(`📊 Inserted ${licenses.length} sample licenses`);

        // Display summary
        const vendorCounts = await License.aggregate([
            { $group: { _id: '$vendor', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log('\n📈 License Summary by Vendor:');
        vendorCounts.forEach(({ _id, count }) => {
            console.log(`   ${_id}: ${count} licenses`);
        });

        const totalCost = licenses.reduce((sum, lic) => sum + lic.cost, 0);
        console.log(`\n💰 Total Monthly Cost: $${totalCost.toLocaleString()}`);

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
