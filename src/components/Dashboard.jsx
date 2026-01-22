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
    const [stats] = useState({
        totalLicenses: 1247,
        activeLicenses: 892,
        expiringSoon: 23,
        potentialSavings: 450000,
        monthlyCost: 125000,
        utilizationRate: 71.5,
        complianceScore: 94,
    });

    const [activities] = useState([
        { id: 1, type: 'renewal', vendor: 'Microsoft', action: 'License renewed', time: '2 hours ago', status: 'success' },
        { id: 2, type: 'alert', vendor: 'SAP', action: 'Expiring in 30 days', time: '5 hours ago', status: 'warning' },
        { id: 3, type: 'optimization', vendor: 'Oracle', action: 'Savings identified', time: '1 day ago', status: 'info' },
        { id: 4, type: 'audit', vendor: 'Salesforce', action: 'Compliance check passed', time: '2 days ago', status: 'success' },
        { id: 5, type: 'alert', vendor: 'IBM', action: 'Over-provisioned licenses', time: '3 days ago', status: 'warning' },
    ]);

    // Cost Trend Chart Data
    const costTrendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Actual Cost',
                data: [135000, 128000, 132000, 125000, 122000, 125000],
                borderColor: 'hsl(220, 75%, 55%)',
                backgroundColor: 'hsla(220, 75%, 55%, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Optimized Cost',
                data: [130000, 122000, 125000, 118000, 115000, 117000],
                borderColor: 'hsl(145, 65%, 50%)',
                backgroundColor: 'hsla(145, 65%, 50%, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    // License Distribution Chart
    const licenseDistData = {
        labels: ['Microsoft', 'SAP', 'Oracle', 'Salesforce', 'IBM', 'Other'],
        datasets: [{
            data: [350, 280, 210, 180, 150, 77],
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

    // Vendor Spending Chart
    const vendorSpendingData = {
        labels: ['Microsoft', 'SAP', 'Oracle', 'Salesforce', 'IBM'],
        datasets: [{
            label: 'Monthly Spend ($)',
            data: [45000, 32000, 24000, 15000, 9000],
            backgroundColor: 'hsl(220, 75%, 55%)',
            borderRadius: 8,
        }]
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
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    }
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
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'var(--text-tertiary)'
                }
            },
            y: {
                grid: {
                    color: 'var(--border-color)',
                },
                ticks: {
                    color: 'var(--text-tertiary)'
                }
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
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    }
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

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="animate-fade-in">Software License Dashboard</h1>
                        <p className="text-secondary">Monitor and optimize your software licenses in real-time</p>
                    </div>
                    <button className="btn btn-primary">
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
                            <div className="stat-change positive">+12% from last month</div>
                        </div>
                    </div>

                    <div className="stat-card card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>✅</div>
                        <div className="stat-content">
                            <div className="stat-label">Active Licenses</div>
                            <div className="stat-value">{stats.activeLicenses.toLocaleString()}</div>
                            <div className="stat-change positive">{stats.utilizationRate}% utilization</div>
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

                {/* Recent Activity */}
                <div className="activity-section card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Activity</h3>
                        <a href="/licenses" className="text-primary">View All →</a>
                    </div>
                    <div className="activity-list">
                        {activities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-indicator ${activity.status}`}></div>
                                <div className="activity-content">
                                    <div className="activity-main">
                                        <span className="activity-vendor font-semibold">{activity.vendor}</span>
                                        <span className="activity-action">{activity.action}</span>
                                    </div>
                                    <div className="activity-time">{activity.time}</div>
                                </div>
                                <span className={`badge badge-${activity.status}`}>{activity.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="action-grid">
                        <button className="action-card glass-card">
                            <span className="action-icon">➕</span>
                            <span className="action-label">Add License</span>
                        </button>
                        <button className="action-card glass-card">
                            <span className="action-icon">🔍</span>
                            <span className="action-label">Run Audit</span>
                        </button>
                        <button className="action-card glass-card">
                            <span className="action-icon">⚡</span>
                            <span className="action-label">Optimize</span>
                        </button>
                        <button className="action-card glass-card">
                            <span className="action-icon">📊</span>
                            <span className="action-label">Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
