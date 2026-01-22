import { Line, Bar } from 'react-chartjs-2';
import './Analytics.css';

function Analytics() {
    // ROI Analysis Data
    const roiData = {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'],
        datasets: [
            {
                label: 'Investment',
                data: [150000, 140000, 138000, 132000, 130000],
                borderColor: 'hsl(355, 75%, 55%)',
                backgroundColor: 'hsla(355, 75%, 55%, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Actual Value',
                data: [145000, 148000, 152000, 155000, 158000],
                borderColor: 'hsl(145, 65%, 50%)',
                backgroundColor: 'hsla(145, 65%, 50%, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    // Cost Savings Over Time
    const savingsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Savings ($)',
            data: [5000, 8000, 10000, 12000, 13500, 15000],
            backgroundColor: 'hsl(145, 65%, 50%)',
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
                    font: { size: 12, family: "'Inter', sans-serif" }
                }
            },
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

    const kpis = [
        { label: 'Total Savings YTD', value: '$63.5K', change: '+24%', trend: 'up' },
        { label: 'Cost Avoidance', value: '$128K', change: '+18%', trend: 'up' },
        { label: 'Compliance Rate', value: '94%', change: '+6%', trend: 'up' },
        { label: 'Average ROI', value: '235%', change: '+12%', trend: 'up' },
    ];

    const insights = [
        { title: 'Underutilized Licenses', description: 'IBM licenses show only 51% utilization', impact: 'High', action: 'Review and optimize' },
        { title: 'Renewal Optimization', description: '23 licenses expiring in next 30 days', impact: 'Medium', action: 'Negotiate renewals' },
        { title: 'Cost Trend', description: 'Monthly costs reduced by 15% over 6 months', impact: 'Positive', action: 'Continue monitoring' },
        { title: 'Compliance Gap', description: 'Oracle licenses need audit preparation', impact: 'High', action: 'Address immediately' },
    ];

    return (
        <div className="analytics">
            <div className="container">
                <div className="analytics-header">
                    <div>
                        <h1>Analytics & Insights</h1>
                        <p className="text-secondary">Data-driven insights for license optimization</p>
                    </div>
                    <button className="btn btn-primary">
                        <span>📥</span>
                        Export Analytics
                    </button>
                </div>

                {/* KPIs */}
                <div className="kpi-grid">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="kpi-card card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="kpi-label">{kpi.label}</div>
                            <div className="kpi-value">{kpi.value}</div>
                            <div className={`kpi-change ${kpi.trend}`}>
                                <span className="kpi-arrow">{kpi.trend === 'up' ? '↑' : '↓'}</span>
                                {kpi.change}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="analytics-charts">
                    <div className="chart-card card">
                        <div className="card-header">
                            <h3 className="card-title">ROI Analysis</h3>
                            <span className="badge badge-success">235% Avg ROI</span>
                        </div>
                        <div className="chart-container">
                            <Line data={roiData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-card card">
                        <div className="card-header">
                            <h3 className="card-title">Cost Savings Trend</h3>
                            <span className="badge badge-info">$63.5K YTD</span>
                        </div>
                        <div className="chart-container">
                            <Bar data={savingsData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="insights-section card">
                    <h3>AI-Powered Insights</h3>
                    <div className="insights-grid">
                        {insights.map((insight, index) => (
                            <div key={index} className="insight-card">
                                <div className="insight-header">
                                    <h4>{insight.title}</h4>
                                    <span className={`badge badge-${insight.impact === 'High' ? 'danger' :
                                            insight.impact === 'Medium' ? 'warning' : 'success'
                                        }`}>
                                        {insight.impact} Impact
                                    </span>
                                </div>
                                <p className="insight-description">{insight.description}</p>
                                <div className="insight-action">
                                    <span className="insight-action-label">Recommended Action:</span>
                                    <span className="insight-action-text">{insight.action}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vendor Performance */}
                <div className="vendor-performance card">
                    <h3>Vendor Performance Comparison</h3>
                    <div className="performance-table">
                        <div className="performance-row header">
                            <div>Vendor</div>
                            <div>Utilization</div>
                            <div>Cost Efficiency</div>
                            <div>Compliance</div>
                            <div>Score</div>
                        </div>
                        {[
                            { vendor: 'Microsoft', util: 84, cost: 92, comp: 96, score: 91 },
                            { vendor: 'SAP', util: 72, cost: 78, comp: 88, score: 79 },
                            { vendor: 'Oracle', util: 78, cost: 72, comp: 82, score: 77 },
                            { vendor: 'Salesforce', util: 66, cost: 85, comp: 94, score: 82 },
                            { vendor: 'IBM', util: 51, cost: 68, comp: 78, score: 66 },
                        ].map((row, index) => (
                            <div key={index} className="performance-row">
                                <div className="vendor-name font-semibold">{row.vendor}</div>
                                <div className="performance-bar-cell">
                                    <div className="performance-bar" style={{ width: `${row.util}%` }}></div>
                                    <span>{row.util}%</span>
                                </div>
                                <div className="performance-bar-cell">
                                    <div className="performance-bar" style={{ width: `${row.cost}%` }}></div>
                                    <span>{row.cost}%</span>
                                </div>
                                <div className="performance-bar-cell">
                                    <div className="performance-bar" style={{ width: `${row.comp}%` }}></div>
                                    <span>{row.comp}%</span>
                                </div>
                                <div className="score-cell">
                                    <span className={`score-badge ${row.score >= 80 ? 'good' : row.score >= 70 ? 'fair' : 'poor'}`}>
                                        {row.score}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
