import { useState } from 'react';


function VendorOptimization() {
    const [selectedVendor, setSelectedVendor] = useState('Microsoft');

    const vendors = {
        Microsoft: {
            icon: '🪟',
            color: 'hsl(220, 75%, 55%)',
            totalLicenses: 750,
            monthlyCost: 57500,
            utilizationRate: 84,
            potentialSavings: 12000,
            opportunities: [
                { type: 'Unused Licenses', count: 120, saving: 6000, priority: 'high' },
                { type: 'Downgrade Opportunity', count: 85, saving: 4200, priority: 'medium' },
                { type: 'Consolidation', count: 30, saving: 1800, priority: 'low' },
            ],
            recommendations: [
                'Consider migrating 120 unused E5 licenses to E3 tier',
                'Azure Reserved Instances can save up to 20% on compute',
                'Consolidate multiple Power BI subscriptions',
                'Review inactive Teams licenses'
            ]
        },
        SAP: {
            icon: '💼',
            color: 'hsl(200, 80%, 55%)',
            totalLicenses: 480,
            monthlyCost: 40000,
            utilizationRate: 72,
            potentialSavings: 8500,
            opportunities: [
                { type: 'Inactive Users', count: 95, saving: 5000, priority: 'high' },
                { type: 'License Optimization', count: 45, saving: 2500, priority: 'medium' },
                { type: 'Module Consolidation', count: 20, saving: 1000, priority: 'low' },
            ],
            recommendations: [
                'Remove 95 inactive user licenses',
                'Optimize S/4HANA module usage',
                'Consider SAP Analytics Cloud consolidation',
                'Review professional vs developer licenses'
            ]
        },
        Oracle: {
            icon: '🔴',
            color: 'hsl(355, 75%, 55%)',
            totalLicenses: 330,
            monthlyCost: 42000,
            utilizationRate: 78,
            potentialSavings: 10500,
            opportunities: [
                { type: 'Compliance Risk', count: 65, saving: 6500, priority: 'high' },
                { type: 'Cloud Migration', count: 55, saving: 3000, priority: 'medium' },
                { type: 'License Pooling', count: 25, saving: 1000, priority: 'low' },
            ],
            recommendations: [
                'Address 65 potential compliance gaps',
                'Migrate on-premise licenses to OCI',
                'Implement license pooling strategy',
                'Review processor-based licensing'
            ]
        },
        Salesforce: {
            icon: '☁️',
            color: 'hsl(200, 85%, 65%)',
            totalLicenses: 500,
            monthlyCost: 25000,
            utilizationRate: 66,
            potentialSavings: 7200,
            opportunities: [
                { type: 'Inactive Users', count: 150, saving: 4500, priority: 'high' },
                { type: 'Feature Optimization', count: 70, saving: 2100, priority: 'medium' },
                { type: 'Edition Downgrade', count: 30, saving: 600, priority: 'low' },
            ],
            recommendations: [
                'Deactivate 150 inactive user licenses',
                'Optimize Sales vs Service Cloud usage',
                'Consider bundled enterprise packages',
                'Review Marketing Cloud utilization'
            ]
        },
        IBM: {
            icon: '🔷',
            color: 'hsl(220, 90%, 60%)',
            totalLicenses: 180,
            monthlyCost: 15000,
            utilizationRate: 51,
            potentialSavings: 5500,
            opportunities: [
                { type: 'Low Utilization', count: 88, saving: 3500, priority: 'high' },
                { type: 'Cloud Pak Optimization', count: 35, saving: 1500, priority: 'medium' },
                { type: 'Watson Consolidation', count: 15, saving: 500, priority: 'low' },
            ],
            recommendations: [
                'Address 88 underutilized licenses (51% usage)',
                'Optimize Cloud Pak deployment',
                'Consolidate Watson services',
                'Review processor value units (PVU) allocation'
            ]
        }
    };

    const vendor = vendors[selectedVendor];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'info';
        }
    };

    return (
        <div className="vendor-optimization">
            <div className="container">
                <div className="optimization-header">
                    <div>
                        <h1>Vendor Optimization</h1>
                        <p className="text-secondary">Identify savings and optimization opportunities by vendor</p>
                    </div>
                </div>

                {/* Vendor Selector */}
                <div className="vendor-selector">
                    {Object.keys(vendors).map(vendorName => (
                        <button
                            key={vendorName}
                            className={`vendor-tab ${selectedVendor === vendorName ? 'active' : ''}`}
                            onClick={() => setSelectedVendor(vendorName)}
                            style={{
                                '--vendor-color': vendors[vendorName].color
                            }}
                        >
                            <span className="vendor-tab-icon">{vendors[vendorName].icon}</span>
                            <span className="vendor-tab-name">{vendorName}</span>
                        </button>
                    ))}
                </div>

                {/* Vendor Overview */}
                <div className="vendor-overview">
                    <div className="overview-card card">
                        <div className="overview-icon" style={{ background: vendor.color }}>
                            {vendor.icon}
                        </div>
                        <div className="overview-details">
                            <h2>{selectedVendor} Overview</h2>
                            <div className="overview-stats">
                                <div className="overview-stat">
                                    <div className="overview-stat-label">Total Licenses</div>
                                    <div className="overview-stat-value">{vendor.totalLicenses.toLocaleString()}</div>
                                </div>
                                <div className="overview-stat">
                                    <div className="overview-stat-label">Monthly Cost</div>
                                    <div className="overview-stat-value">${(vendor.monthlyCost / 1000).toFixed(1)}K</div>
                                </div>
                                <div className="overview-stat">
                                    <div className="overview-stat-label">Utilization Rate</div>
                                    <div className="overview-stat-value">{vendor.utilizationRate}%</div>
                                </div>
                                <div className="overview-stat">
                                    <div className="overview-stat-label">Potential Savings</div>
                                    <div className="overview-stat-value gradient-text">${(vendor.potentialSavings / 1000).toFixed(1)}K</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optimization Opportunities */}
                <div className="opportunities-section">
                    <h3>Optimization Opportunities</h3>
                    <div className="opportunities-grid">
                        {vendor.opportunities.map((opp, index) => (
                            <div key={index} className="opportunity-card card">
                                <div className="opportunity-header">
                                    <h4>{opp.type}</h4>
                                    <span className={`badge badge-${getPriorityColor(opp.priority)}`}>
                                        {opp.priority} priority
                                    </span>
                                </div>
                                <div className="opportunity-body">
                                    <div className="opportunity-metric">
                                        <span className="metric-value">{opp.count}</span>
                                        <span className="metric-label">licenses affected</span>
                                    </div>
                                    <div className="opportunity-savings">
                                        <div className="savings-amount">${(opp.saving / 1000).toFixed(1)}K/month</div>
                                        <div className="savings-label">Potential Savings</div>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-sm">Review Details</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="recommendations-section card">
                    <h3>AI-Powered Recommendations</h3>
                    <div className="recommendations-list">
                        {vendor.recommendations.map((rec, index) => (
                            <div key={index} className="recommendation-item">
                                <div className="recommendation-icon">💡</div>
                                <div className="recommendation-text">{rec}</div>
                                <button className="btn-secondary btn-sm">Apply</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="optimization-actions">
                    <button className="btn btn-primary btn-lg">
                        <span>⚡</span>
                        Run Full Optimization Analysis
                    </button>
                    <button className="btn btn-secondary btn-lg">
                        <span>📊</span>
                        Generate Optimization Report
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VendorOptimization;
