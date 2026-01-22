import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { analyticsAPI } from '../services/api';

function Analytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [costSummary, setCostSummary] = useState(null);
    const [vendorStats, setVendorStats] = useState({});
    const [vendorComparison, setVendorComparison] = useState([]);
    const [opportunities, setOpportunities] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [summaryRes, trendsRes, comparisonRes, oppsRes] = await Promise.all([
                    analyticsAPI.getCostSummary(),
                    analyticsAPI.getUsageTrends(),
                    analyticsAPI.getVendorComparison(),
                    analyticsAPI.getOpportunities()
                ]);

                setCostSummary(summaryRes.data);
                setVendorStats(trendsRes.data);
                setVendorComparison(comparisonRes.data);
                setOpportunities(oppsRes.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // Prepare Chart Data
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#9CA3AF', // gray-400
                    padding: 15,
                    font: { size: 12, family: "'Inter', sans-serif" }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            },
            y: {
                grid: { color: '#374151' }, // gray-700
                ticks: { color: '#9CA3AF' }
            }
        }
    };

    const vendors = Object.keys(vendorStats);

    // Usage Trends Data (Bar Chart)
    const usageData = {
        labels: vendors,
        datasets: [{
            label: 'Average Usage (%)',
            data: vendors.map(v => vendorStats[v].avgUsage),
            backgroundColor: vendors.map((_, i) => `hsl(${200 + i * 30}, 70%, 50%)`),
            borderRadius: 6,
        }]
    };

    // Cost Distribution Data (Doughnut - Simulated as Line for now to match UI layout expectation)
    // Actually user had Line and Bar. Let's use Bar for Cost per Vendor
    const costData = {
        labels: vendorComparison.map(v => v.vendor),
        datasets: [{
            label: 'Total Cost ($)',
            data: vendorComparison.map(v => v.totalCost),
            backgroundColor: 'hsl(250, 70%, 60%)',
            borderRadius: 6,
        }]
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Data-driven insights for license optimization</p>
                    </div>
                    <button className="btn btn-primary">
                        <span>📥</span>
                        Export Analytics
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center animate-fade-in">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Licenses</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{costSummary?.totalLicenses || 0}</p>
                    </div>
                    <div className="card text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Avg Utilization</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{costSummary?.avgUtilization || 0}%</p>
                    </div>
                    <div className="card text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Potential Savings</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">${(costSummary?.potentialSavings / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="card text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Underutilized</p>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{opportunities?.underutilized || 0}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Average Usage by Vendor</h3>
                        </div>
                        <div className="h-64">
                            <Bar data={usageData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Total Cost by Vendor</h3>
                        </div>
                        <div className="h-64">
                            <Bar data={costData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="card mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">AI-Powered Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {opportunities?.underutilized > 0 && (
                            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-orange-800 dark:text-orange-300">Underutilized Licenses</h4>
                                    <span className="badge badge-warning">Medium Impact</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    {opportunities.underutilized} licenses are being used less than 50%.
                                    Consider reclaiming or downgrading.
                                </p>
                                <button className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline">Review & Optimize →</button>
                            </div>
                        )}

                        {opportunities?.expiringSoon > 0 && (
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-blue-800 dark:text-blue-300">Upcoming Renewals</h4>
                                    <span className="badge badge-info">Low Impact</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    {opportunities.expiringSoon} licenses are expiring in the next 30 days.
                                    Prepare for negotiation.
                                </p>
                                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Renewals →</button>
                            </div>
                        )}

                        {opportunities?.highCost > 0 && (
                            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-purple-800 dark:text-purple-300">High Cost Licenses</h4>
                                    <span className="badge badge-danger">High Impact</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    {opportunities.highCost} licenses cost over $10k/year.
                                    Ensure these are critical business apps.
                                </p>
                                <button className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">Analyze Spending →</button>
                            </div>
                        )}

                        {/* Fallback Insight if everything is perfect */}
                        {(!opportunities?.underutilized && !opportunities?.expiringSoon && !opportunities?.highCost) && (
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 col-span-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-green-800 dark:text-green-300">Optimization Score: Excellent</h4>
                                    <span className="badge badge-success">Good Job</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Your portfolio is well-optimized. No critical issues detected at this time.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vendor Performance */}
                <div className="card overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Vendor Performance Comparison</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Vendor</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Licenses</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Utilization</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Total Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {vendorComparison.map((vendor, index) => {
                                    // Calculate mock score
                                    const score = Math.round((vendor.avgUtilization * 0.7) + (vendor.totalLicenses > 0 ? 30 : 0));

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{vendor.vendor}</td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{vendor.totalLicenses}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${vendor.avgUtilization >= 80 ? 'bg-green-500' : vendor.avgUtilization >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${vendor.avgUtilization}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{vendor.avgUtilization}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                ${vendor.totalCost.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge ${score >= 80 ? 'badge-success' : score >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                                                    {score}/100
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
