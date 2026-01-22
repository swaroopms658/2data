import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { licenseAPI, analyticsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';


// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalLicenses: 0,
        activeLicenses: 0,
        expiringSoon: 0,
        potentialSavings: 0,
        monthlyCost: 0,
        utilizationRate: 0,
        complianceScore: 94,
    });

    const [vendorData, setVendorData] = useState({});
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch licenses and analytics in parallel
            const [licensesRes, costSummaryRes] = await Promise.all([
                licenseAPI.getAll(),
                analyticsAPI.getCostSummary().catch(() => ({ data: {} }))
            ]);

            const licensesData = licensesRes.data;
            setLicenses(licensesData);

            // Calculate stats from licenses
            const totalLicenses = licensesData.length;
            const activeLicenses = licensesData.filter(l => l.status === 'active').length;
            const expiringSoon = licensesData.filter(l => {
                const daysUntil = (new Date(l.renewalDate) - new Date()) / (1000 * 60 * 60 * 24);
                return daysUntil < 30 && daysUntil > 0;
            }).length;

            const monthlyCost = licensesData.reduce((sum, l) => sum + (l.cost || 0), 0);
            const avgUtilization = licensesData.length > 0
                ? licensesData.reduce((sum, l) => sum + (l.usage || 0), 0) / licensesData.length
                : 0;

            // Calculate potential savings (licenses with usage < 50%)
            const underutilized = licensesData.filter(l => (l.usage || 0) < 50);
            const potentialSavings = underutilized.reduce((sum, l) => sum + (l.cost || 0) * 0.3, 0);

            setStats({
                totalLicenses,
                activeLicenses,
                expiringSoon,
                potentialSavings: Math.round(potentialSavings),
                monthlyCost,
                utilizationRate: Math.round(avgUtilization),
                complianceScore: 94,
            });

            // Group licenses by vendor for charts
            const groupedByVendor = licensesData.reduce((acc, lic) => {
                if (!acc[lic.vendor]) {
                    acc[lic.vendor] = { count: 0, cost: 0 };
                }
                acc[lic.vendor].count++;
                acc[lic.vendor].cost += lic.cost || 0;
                return acc;
            }, {});

            setVendorData(groupedByVendor);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate chart data from real vendor data
    const vendors = Object.keys(vendorData);
    const licenseDistData = {
        labels: vendors,
        datasets: [{
            data: vendors.map(v => vendorData[v]?.count || 0),
            backgroundColor: [
                'hsl(220, 75%, 55%)',
                'hsl(280, 65%, 55%)',
                'hsl(38, 92%, 50%)',
                'hsl(200, 80%, 55%)',
                'hsl(145, 65%, 50%)',
                'hsl(0, 0%, 60%)',
            ],
            borderWidth: 0,
        }]
    };

    const vendorSpendingData = {
        labels: vendors,
        datasets: [{
            label: 'Monthly Spend ($)',
            data: vendors.map(v => vendorData[v]?.cost || 0),
            backgroundColor: 'hsl(220, 75%, 55%)',
            borderRadius: 8,
        }]
    };

    // Cost trend - use sample data for now (would need historical data)
    const costTrendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Actual Cost',
                data: [135000, 128000, 132000, 125000, 122000, stats.monthlyCost],
                borderColor: 'hsl(220, 75%, 55%)',
                backgroundColor: 'hsla(220, 75%, 55%, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'var(--text-secondary)',
                    padding: 15,
                    font: { size: 12, family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: 'var(--bg-card)',
                titleColor: 'var(--text-primary)',
                bodyColor: 'var(--text-secondary)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'var(--text-tertiary)' }
            },
            y: {
                grid: { color: 'var(--border-color)' },
                ticks: { color: 'var(--text-tertiary)' }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'var(--text-secondary)',
                    padding: 10,
                    font: { size: 11, family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: 'var(--bg-card)',
                titleColor: 'var(--text-primary)',
                bodyColor: 'var(--text-secondary)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">
                            Software License Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Monitor and optimize your software licenses in real-time
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => alert('Export feature coming soon!')}
                    >
                        <span>📥</span>
                        Export Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center animate-fade-in">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl">
                            📊
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Licenses</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {stats.totalLicenses.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">All vendors</p>
                    </div>

                    <div className="card text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-2xl">
                            ✅
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Active Licenses</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {stats.activeLicenses.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stats.utilizationRate}% avg usage</p>
                    </div>

                    <div className="card text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-600 to-yellow-600 flex items-center justify-center text-2xl">
                            ⚠️
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Expiring Soon</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {stats.expiringSoon}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Next 30 days</p>
                    </div>

                    <div className="card text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                            💰
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Potential Savings</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${(stats.potentialSavings / 1000).toFixed(0)}K
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">Optimization opportunities</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cost Trend Analysis</h3>
                            <span className="badge badge-info">Last 6 Months</span>
                        </div>
                        <div className="h-64">
                            <Line data={costTrendData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">License Distribution</h3>
                            <span className="badge badge-success">{stats.totalLicenses} Total</span>
                        </div>
                        <div className="h-64">
                            <Doughnut data={licenseDistData} options={doughnutOptions} />
                        </div>
                    </div>

                    <div className="card lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vendor Spending Breakdown</h3>
                            <span className="badge badge-warning">${(stats.monthlyCost / 1000).toFixed(0)}K/month</span>
                        </div>
                        <div className="h-64">
                            <Bar data={vendorSpendingData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            className="card hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer p-6 flex flex-col items-center gap-3"
                            onClick={() => navigate('/licenses')}
                        >
                            <span className="text-4xl">➕</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Manage Licenses</span>
                        </button>
                        <button
                            className="card hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer p-6 flex flex-col items-center gap-3"
                            onClick={() => navigate('/audit')}
                        >
                            <span className="text-4xl">🔍</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Run Audit</span>
                        </button>
                        <button
                            className="card hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer p-6 flex flex-col items-center gap-3"
                            onClick={() => navigate('/optimization')}
                        >
                            <span className="text-4xl">⚡</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Optimize</span>
                        </button>
                        <button
                            className="card hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer p-6 flex flex-col items-center gap-3"
                            onClick={() => navigate('/analytics')}
                        >
                            <span className="text-4xl">📊</span>
                            <span className="font-semibold text-gray-900 dark:text-white">View Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
