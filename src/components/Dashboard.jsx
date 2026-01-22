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
import './Dashboard.css';

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
            <div className="dashboard">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="animate-fade-in">Software License Dashboard</h1>
                        <p className="text-secondary">Monitor and optimize your software licenses in real-time</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => alert('Export feature coming soon!')}>
                        <span>📥</span>
                        Export Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>📊</div>
                        <div className="stat-content">
                            <div className="stat-label">Total Licenses</div>
                            <div className="stat-value">{stats.totalLicenses.toLocaleString()}</div>
                            <div className="stat-change positive">All vendors</div>
                        </div>
                    </div>

                    <div className="stat-card card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>✅</div>
                        <div className="stat-content">
                            <div className="stat-label">Active Licenses</div>
                            <div className="stat-value">{stats.activeLicenses.toLocaleString()}</div>
                            <div className="stat-change positive">{stats.utilizationRate}% avg usage</div>
                        </div>
                    </div>

                    <div className="stat-card card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="stat-icon" style={{ background: 'var(--gradient-warm)' }}>⚠️</div>
                        <div className="stat-content">
                            <div className="stat-label">Expiring Soon</div>
                            <div className="stat-value">{stats.expiringSoon}</div>
                            <div className="stat-change neutral">Next 30 days</div>
                        </div>
                    </div>

                    <div className="stat-card card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>💰</div>
                        <div className="stat-content">
                            <div className="stat-label">Potential Savings</div>
                            <div className="stat-value">${(stats.potentialSavings / 1000).toFixed(0)}K</div>
                            <div className="stat-change positive">Optimization opportunities</div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    <div className="chart-card card">
                        <div className="card-header">
                            <h3 className="card-title">Cost Trend Analysis</h3>
                            <span className="badge badge-info">Last 6 Months</span>
                        </div>
                        <div className="chart-container">
                            <Line data={costTrendData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-card card">
                        <div className="card-header">
                            <h3 className="card-title">License Distribution</h3>
                            <span className="badge badge-success">{stats.totalLicenses} Total</span>
                        </div>
                        <div className="chart-container">
                            <Doughnut data={licenseDistData} options={doughnutOptions} />
                        </div>
                    </div>

                    <div className="chart-card card" style={{ gridColumn: 'span 2' }}>
                        <div className="card-header">
                            <h3 className="card-title">Vendor Spending Breakdown</h3>
                            <span className="badge badge-warning">${(stats.monthlyCost / 1000).toFixed(0)}K/month</span>
                        </div>
                        <div className="chart-container">
                            <Bar data={vendorSpendingData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="action-grid">
                        <button className="action-card glass-card" onClick={() => navigate('/licenses')}>
                            <span className="action-icon">➕</span>
                            <span className="action-label">Manage Licenses</span>
                        </button>
                        <button className="action-card glass-card" onClick={() => navigate('/audit')}>
                            <span className="action-icon">🔍</span>
                            <span className="action-label">Run Audit</span>
                        </button>
                        <button className="action-card glass-card" onClick={() => navigate('/optimization')}>
                            <span className="action-icon">⚡</span>
                            <span className="action-label">Optimize</span>
                        </button>
                        <button className="action-card glass-card" onClick={() => navigate('/analytics')}>
                            <span className="action-icon">📊</span>
                            <span className="action-label">View Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
