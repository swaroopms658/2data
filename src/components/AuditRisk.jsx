import { Doughnut } from 'react-chartjs-2';
import './AuditRisk.css';

function AuditRisk() {
    const overallScore = 94;

    const riskData = {
        labels: ['Compliant', 'At Risk'],
        datasets: [{
            data: [overallScore, 100 - overallScore],
            backgroundColor: [
                'hsl(145, 65%, 50%)',
                'hsl(0, 0%, 85%)',
            ],
            borderWidth: 0,
        }]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    };

    const vendors = [
        { name: 'Microsoft', score: 96, issues: 2, status: 'excellent' },
        { name: 'SAP', score: 88, issues: 5, status: 'good' },
        { name: 'Oracle', score: 82, issues: 12, status: 'moderate' },
        { name: 'Salesforce', score: 94, issues: 3, status: 'excellent' },
        { name: 'IBM', score: 78, issues: 18, status: 'moderate' },
    ];

    const risks = [
        {
            vendor: 'Oracle',
            type: 'Compliance Gap',
            severity: 'high',
            description: '65 potential compliance violations detected',
            recommendation: 'Conduct immediate license audit and remediation',
            deadline: '2026-02-15'
        },
        {
            vendor: 'IBM',
            type: 'Over-deployment',
            severity: 'medium',
            description: '88 licenses deployed beyond entitlement',
            recommendation: 'Review PVU allocation and adjust deployment',
            deadline: '2026-03-01'
        },
        {
            vendor: 'SAP',
            type: 'Indirect Access',
            severity: 'high',
            description: 'Potential indirect access usage without proper licensing',
            recommendation: 'Assess indirect access scenarios and acquire licenses',
            deadline: '2026-02-20'
        },
        {
            vendor: 'Microsoft',
            type: 'Mobility Rights',
            severity: 'low',
            description: 'Cloud mobility rights not fully documented',
            recommendation: 'Update license documentation for audit readiness',
            deadline: '2026-04-01'
        },
    ];

    const complianceChecklist = [
        { item: 'License inventory up to date', completed: true },
        { item: 'Proof of purchase documented', completed: true },
        { item: 'License assignments tracked', completed: true },
        { item: 'Deployment records maintained', completed: false },
        { item: 'Audit history archived', completed: true },
        { item: 'Indirect access assessed', completed: false },
        { item: 'Cloud entitlements verified', completed: true },
        { item: 'Termination procedures defined', completed: false },
    ];

    const getScoreColor = (score) => {
        if (score >= 90) return 'success';
        if (score >= 80) return 'warning';
        return 'danger';
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'info';
        }
    };

    return (
        <div className="audit-risk">
            <div className="container">
                <div className="audit-header">
                    <div>
                        <h1>Audit Risk Assessment</h1>
                        <p className="text-secondary">Monitor compliance and prepare for software audits</p>
                    </div>
                    <button className="btn btn-primary">
                        <span>🛡️</span>
                        Run Audit Scan
                    </button>
                </div>

                {/* Overall Score */}
                <div className="score-overview card">
                    <div className="score-chart">
                        <div className="chart-wrapper">
                            <Doughnut data={riskData} options={doughnutOptions} />
                            <div className="score-center">
                                <div className="score-number">{overallScore}</div>
                                <div className="score-label">Compliance Score</div>
                            </div>
                        </div>
                    </div>
                    <div className="score-details">
                        <h2>Overall Compliance Status</h2>
                        <p className="score-description">
                            Your organization maintains an excellent compliance posture with a score of {overallScore}/100.
                            Continue monitoring high-risk areas and address identified gaps to maintain audit readiness.
                        </p>
                        <div className="score-metrics">
                            <div className="metric-item">
                                <div className="metric-value">1,247</div>
                                <div className="metric-label">Total Licenses</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value">1,207</div>
                                <div className="metric-label">Compliant</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value">40</div>
                                <div className="metric-label">At Risk</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor Compliance */}
                <div className="vendor-compliance card">
                    <h3>Vendor Compliance Scores</h3>
                    <div className="compliance-list">
                        {vendors.map((vendor, index) => (
                            <div key={index} className="compliance-item">
                                <div className="compliance-vendor">
                                    <div className="vendor-name font-semibold">{vendor.name}</div>
                                    <div className="vendor-issues">{vendor.issues} issues</div>
                                </div>
                                <div className="compliance-score-bar">
                                    <div
                                        className={`score-fill ${vendor.status}`}
                                        style={{ width: `${vendor.score}%` }}
                                    ></div>
                                </div>
                                <div className={`compliance-score badge badge-${getScoreColor(vendor.score)}`}>
                                    {vendor.score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Items */}
                <div className="risk-items-section">
                    <h3>Identified Risks & Remediation</h3>
                    <div className="risk-items">
                        {risks.map((risk, index) => (
                            <div key={index} className="risk-card card">
                                <div className="risk-header">
                                    <div className="risk-vendor-badge">{risk.vendor}</div>
                                    <span className={`badge badge-${getSeverityColor(risk.severity)}`}>
                                        {risk.severity} severity
                                    </span>
                                </div>
                                <h4 className="risk-type">{risk.type}</h4>
                                <p className="risk-description">{risk.description}</p>
                                <div className="risk-recommendation">
                                    <div className="recommendation-label">Recommended Action:</div>
                                    <div className="recommendation-text">{risk.recommendation}</div>
                                </div>
                                <div className="risk-footer">
                                    <div className="risk-deadline">
                                        <span className="deadline-label">Deadline:</span>
                                        <span className="deadline-date">{new Date(risk.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <button className="btn-secondary btn-sm">Mark Resolved</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance Checklist */}
                <div className="compliance-checklist card">
                    <h3>Audit Readiness Checklist</h3>
                    <div className="checklist-grid">
                        {complianceChecklist.map((item, index) => (
                            <div key={index} className="checklist-item">
                                <div className={`checkbox ${item.completed ? 'checked' : ''}`}>
                                    {item.completed && '✓'}
                                </div>
                                <span className={item.completed ? 'completed' : ''}>{item.item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="checklist-progress">
                        <div className="progress-label">
                            {complianceChecklist.filter(i => i.completed).length} of {complianceChecklist.length} completed
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${(complianceChecklist.filter(i => i.completed).length / complianceChecklist.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AuditRisk;
