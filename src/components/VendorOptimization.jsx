import { useState, useEffect } from 'react';
import { analyticsAPI, licenseAPI } from '../services/api';

function VendorOptimization() {
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendorData, setVendorData] = useState(null);
    const [vendorLicenses, setVendorLicenses] = useState([]);

    // Fetch initial vendor list
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await analyticsAPI.getUsageTrends();
                const vendorList = Object.keys(response.data);
                setVendors(vendorList);
                if (vendorList.length > 0) {
                    setSelectedVendor(vendorList[0]);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching vendors:', err);
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    // Fetch details when selected vendor changes
    useEffect(() => {
        if (!selectedVendor) return;

        const fetchVendorDetails = async () => {
            setLoading(true);
            try {
                const [licensesRes, statsRes] = await Promise.all([
                    licenseAPI.getAll({ vendor: selectedVendor }),
                    analyticsAPI.getUsageTrends()
                ]);

                setVendorLicenses(licensesRes.data);
                const stats = statsRes.data[selectedVendor] || { count: 0, totalCost: 0, avgUsage: 0 };
                setVendorData(stats);
            } catch (err) {
                console.error('Error fetching vendor details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDetails();
    }, [selectedVendor]);

    // Calculate Opportunities dynamically
    const calculateOpportunities = () => {
        if (!vendorLicenses.length) return [];

        const opportunities = [];

        // Unused Licenses (< 10% usage)
        const unusedCount = vendorLicenses.filter(l => l.usage < 10).length;
        if (unusedCount > 0) {
            opportunities.push({
                type: 'Unused Licenses',
                count: unusedCount,
                saving: unusedCount * (vendorLicenses[0]?.cost || 0), // Approx saving
                priority: 'high'
            });
        }

        // Low Utilization (< 50% usage)
        const lowUsageCount = vendorLicenses.filter(l => l.usage >= 10 && l.usage < 50).length;
        if (lowUsageCount > 0) {
            opportunities.push({
                type: 'Optimization Candidate',
                count: lowUsageCount,
                saving: lowUsageCount * (vendorLicenses[0]?.cost || 0) * 0.5, // 50% saving assumption
                priority: 'medium'
            });
        }

        // Compliant but could negotiate
        if (opportunities.length === 0) {
            opportunities.push({
                type: 'Consolidation',
                count: Math.ceil(vendorLicenses.length * 0.1),
                saving: (vendorData?.totalCost || 0) * 0.05,
                priority: 'low'
            });
        }

        return opportunities;
    };

    const opportunities = calculateOpportunities();
    const potentialSavings = opportunities.reduce((sum, op) => sum + op.saving, 0);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'info';
        }
    };

    if (loading && !selectedVendor) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendor Optimization</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Identify savings and optimization opportunities by vendor</p>
                    </div>
                </div>

                {/* Vendor Selector */}
                <div className="flex overflow-x-auto gap-4 mb-8 pb-2">
                    {vendors.map(vendorName => (
                        <button
                            key={vendorName}
                            onClick={() => setSelectedVendor(vendorName)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all whitespace-nowrap
                                ${selectedVendor === vendorName
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                                }`}
                        >
                            <span className="font-semibold">{vendorName}</span>
                        </button>
                    ))}
                </div>

                {vendorData && (
                    <>
                        {/* Vendor Overview */}
                        <div className="card mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl">
                                    🏢
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedVendor} Overview</h2>
                                    <p className="text-gray-500 dark:text-gray-400"> comprehensive analysis</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Licenses</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendorData.count}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Cost</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${(vendorData.totalCost / 1000).toFixed(1)}K</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Utilization Rate</p>
                                    <p className={`text-2xl font-bold ${vendorData.avgUsage >= 80 ? 'text-green-600' : vendorData.avgUsage < 50 ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {vendorData.avgUsage}%
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Potential Savings</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${(potentialSavings / 1000).toFixed(1)}K</p>
                                </div>
                            </div>
                        </div>

                        {/* Optimization Opportunities */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Optimization Opportunities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {opportunities.map((opp, index) => (
                                    <div key={index} className="card hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{opp.type}</h4>
                                            <span className={`badge badge-${getPriorityColor(opp.priority)}`}>
                                                {opp.priority} priority
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400">Licenses Affected</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{opp.count}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-600 dark:text-gray-400">Potential Savings</span>
                                                <span className="font-bold text-green-600 dark:text-green-400">${(opp.saving / 1000).toFixed(1)}K/mo</span>
                                            </div>
                                            <button className="w-full btn btn-primary btn-sm">Review Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="card">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">AI-Powered Recommendations</h3>
                            <div className="space-y-4">
                                {opportunities.map((opp, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-xl shrink-0">
                                            💡
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {opp.type === 'Unused Licenses' ? `Deactivate ${opp.count} unused licenses to save immediately.` :
                                                    opp.type === 'Optimization Candidate' ? `Review ${opp.count} licenses with low utilization for potential downgrade.` :
                                                        `Consolidate subscriptions to streamline costs.`}
                                            </p>
                                        </div>
                                        <button className="btn btn-secondary btn-sm whitespace-nowrap">Apply Fix</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default VendorOptimization;
