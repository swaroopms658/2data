import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { licenseAPI, analyticsAPI } from '../services/api';

function AuditRisk() {
    const [loading, setLoading] = useState(true);
    const [overallScore, setOverallScore] = useState(100);
    const [vendorScores, setVendorScores] = useState([]);
    const [risks, setRisks] = useState([]);

    // Persist checklist in local storage for "functional" feel
    const [checklist, setChecklist] = useState(() => {
        const saved = localStorage.getItem('audit_checklist');
        return saved ? JSON.parse(saved) : [
            { id: 1, item: 'License inventory up to date', completed: true },
            { id: 2, item: 'Proof of purchase documented', completed: false },
            { id: 3, item: 'License assignments tracked', completed: true },
            { id: 4, item: 'Deployment records maintained', completed: false },
            { id: 5, item: 'Audit history archived', completed: false },
        ];
    });

    useEffect(() => {
        localStorage.setItem('audit_checklist', JSON.stringify(checklist));
    }, [checklist]);

    const toggleChecklist = (id) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [licensesRes, comparisonRes] = await Promise.all([
                    licenseAPI.getAll(),
                    analyticsAPI.getVendorComparison()
                ]);

                const licenses = licensesRes.data;
                const vendors = comparisonRes.data;

                // Calculate Risks dynamically
                const newRisks = [];

                // Risk 1: Expiring Soon
                const expiring = licenses.filter(l => l.status === 'expiring' ||
                    (new Date(l.renewalDate) - new Date()) / (1000 * 60 * 60 * 24) < 30
                );

                if (expiring.length > 0) {
                    newRisks.push({
                        vendor: 'Multiple',
                        type: 'Renewal Risk',
                        severity: 'high',
                        description: `${expiring.length} licenses expiring within 30 days.`,
                        recommendation: 'Initiate renewal process immediately.',
                        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
                    });
                }

                // Risk 2: Low Utilization (Wasted Spend Risk)
                const wasted = licenses.filter(l => l.usage < 20);
                if (wasted.length > 0) {
                    newRisks.push({
                        vendor: 'Various',
                        type: 'Financial Risk',
                        severity: 'medium',
                        description: `${wasted.length} licenses have < 20% utilization.`,
                        recommendation: 'Reclaim or terminate unused licenses.',
                        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
                    });
                }

                setRisks(newRisks);

                // Calculate Vendor Scores
                const scores = vendors.map(v => ({
                    name: v.vendor,
                    score: Math.max(0, 100 - (v.avgUtilization < 50 ? 20 : 0) - (v.totalLicenses > 100 ? 5 : 0)),
                    issues: (v.avgUtilization < 50 ? 1 : 0) + (v.totalLicenses > 50 ? 1 : 0),
                    status: v.avgUtilization > 80 ? 'excellent' : v.avgUtilization > 50 ? 'good' : 'moderate'
                }));
                setVendorScores(scores);

                // Overall Score
                const avgVendorScore = scores.reduce((sum, s) => sum + s.score, 0) / (scores.length || 1);
                const compliancePenalty = checklist.filter(i => !i.completed).length * 5;
                setOverallScore(Math.round(Math.max(0, avgVendorScore - compliancePenalty)));

            } catch (err) {
                console.error('Error fetching audit data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [checklist]); // Recalculate if checklist changes (affects score)

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
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            default: return 'info';
        }
    };

    if (loading) {
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Risk Assessment</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor compliance and prepare for software audits</p>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="card mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 relative shrink-0">
                        <Doughnut data={riskData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{overallScore}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Overall Compliance Status</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Your organization maintains a <strong>{overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'moderate' : 'critical'}</strong> compliance posture.
                            {overallScore < 100 && ' Completeting checklist items and resolving risks will improve your score.'}
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{vendorScores.length}</div>
                                <div className="text-xs text-gray-500">Vendors</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-red-500">{risks.length}</div>
                                <div className="text-xs text-gray-500">Risks Detected</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xl font-bold text-blue-500">{checklist.filter(c => c.completed).length}/{checklist.length}</div>
                                <div className="text-xs text-gray-500">Checklist</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor Compliance */}
                <div className="card mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Vendor Compliance Scores</h3>
                    <div className="space-y-4">
                        {vendorScores.map((vendor, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-32 font-semibold text-gray-900 dark:text-white">{vendor.name}</div>
                                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${vendor.score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                        style={{ width: `${vendor.score}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right font-bold text-gray-700 dark:text-gray-300">{vendor.score}</div>
                            </div>
                        ))}
                        {vendorScores.length === 0 && <p className="text-gray-500 italic">No vendor data available.</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Risk Items */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Identified Risks</h3>
                        {risks.length === 0 ? (
                            <div className="card bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800">
                                <p className="text-green-700 dark:text-green-300">✅ No critical risks detected.</p>
                            </div>
                        ) : (
                            risks.map((risk, index) => (
                                <div key={index} className="card border-l-4 border-red-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="badge badge-danger">{risk.type}</span>
                                        <span className="text-xs text-gray-500">Due: {new Date(risk.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{risk.vendor}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{risk.description}</p>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Fix:</strong> {risk.recommendation}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Compliance Checklist */}
                    <div className="card h-fit">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Audit Readiness Checklist</h3>
                        <div className="space-y-3">
                            {checklist.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer transition-colors"
                                    onClick={() => toggleChecklist(item.id)}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${item.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {item.completed && '✓'}
                                    </div>
                                    <span className={`text-gray-700 dark:text-gray-300 ${item.completed ? 'line-through opacity-70' : ''}`}>
                                        {item.item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AuditRisk;
