import { useState } from 'react';
import './LicenseInventory.css';

function LicenseInventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterVendor, setFilterVendor] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [licenses] = useState([
        { id: 1, vendor: 'Microsoft', product: 'Microsoft 365 E5', quantity: 500, cost: 45000, renewalDate: '2026-03-15', status: 'active', usage: 92 },
        { id: 2, vendor: 'SAP', product: 'SAP S/4HANA', quantity: 200, cost: 32000, renewalDate: '2026-02-25', status: 'active', usage: 78 },
        { id: 3, vendor: 'Oracle', product: 'Oracle Database Enterprise', quantity: 150, cost: 24000, renewalDate: '2026-02-10', status: 'expiring', usage: 85 },
        { id: 4, vendor: 'Salesforce', product: 'Sales Cloud', quantity: 300, cost: 15000, renewalDate: '2026-04-20', status: 'active', usage: 68 },
        { id: 5, vendor: 'IBM', product: 'IBM Cloud Pak', quantity: 100, cost: 9000, renewalDate: '2026-05-30', status: 'active', usage: 45 },
        { id: 6, vendor: 'Microsoft', product: 'Azure DevOps', quantity: 250, cost: 12500, renewalDate: '2026-03-01', status: 'active', usage: 88 },
        { id: 7, vendor: 'Oracle', product: 'Oracle Cloud Infrastructure', quantity: 180, cost: 18000, renewalDate: '2026-01-28', status: 'expiring', usage: 72 },
        { id: 8, vendor: 'Salesforce', product: 'Service Cloud', quantity: 200, cost: 10000, renewalDate: '2026-06-15', status: 'active', usage: 55 },
        { id: 9, vendor: 'SAP', product: 'SAP Analytics Cloud', quantity: 120, cost: 8000, renewalDate: '2026-02-05', status: 'expiring', usage: 62 },
        { id: 10, vendor: 'IBM', product: 'IBM Watson', quantity: 80, cost: 6000, renewalDate: '2026-07-10', status: 'active', usage: 38 },
    ]);

    const vendors = ['Microsoft', 'SAP', 'Oracle', 'Salesforce', 'IBM'];

    const filteredLicenses = licenses.filter(license => {
        const matchesSearch = license.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            license.vendor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVendor = filterVendor === 'all' || license.vendor === filterVendor;
        const matchesStatus = filterStatus === 'all' || license.status === filterStatus;
        return matchesSearch && matchesVendor && matchesStatus;
    });

    const totalCost = filteredLicenses.reduce((sum, license) => sum + license.cost, 0);
    const totalQuantity = filteredLicenses.reduce((sum, license) => sum + license.quantity, 0);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'expiring': return 'warning';
            case 'inactive': return 'danger';
            default: return 'info';
        }
    };

    const getUsageColor = (usage) => {
        if (usage >= 80) return 'var(--success)';
        if (usage >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div className="license-inventory">
            <div className="container">
                <div className="inventory-header">
                    <div>
                        <h1>License Inventory</h1>
                        <p className="text-secondary">Manage and track all your software licenses</p>
                    </div>
                    <button className="btn btn-primary">
                        <span>➕</span>
                        Add License
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="summary-grid">
                    <div className="summary-card card">
                        <div className="summary-label">Total Licenses</div>
                        <div className="summary-value">{filteredLicenses.length}</div>
                    </div>
                    <div className="summary-card card">
                        <div className="summary-label">Total Quantity</div>
                        <div className="summary-value">{totalQuantity.toLocaleString()}</div>
                    </div>
                    <div className="summary-card card">
                        <div className="summary-label">Monthly Cost</div>
                        <div className="summary-value">${(totalCost / 1000).toFixed(1)}K</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section card">
                    <div className="filter-group">
                        <input
                            type="text"
                            className="input"
                            placeholder="🔍 Search licenses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            className="select"
                            value={filterVendor}
                            onChange={(e) => setFilterVendor(e.target.value)}
                        >
                            <option value="all">All Vendors</option>
                            {vendors.map(vendor => (
                                <option key={vendor} value={vendor}>{vendor}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <select
                            className="select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expiring">Expiring Soon</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* License Table */}
                <div className="license-table card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Vendor</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Monthly Cost</th>
                                    <th>Renewal Date</th>
                                    <th>Usage</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLicenses.map(license => (
                                    <tr key={license.id}>
                                        <td>
                                            <div className="vendor-cell">
                                                <span className="vendor-badge">{license.vendor.charAt(0)}</span>
                                                <span className="font-semibold">{license.vendor}</span>
                                            </div>
                                        </td>
                                        <td>{license.product}</td>
                                        <td>{license.quantity.toLocaleString()}</td>
                                        <td className="font-semibold">${license.cost.toLocaleString()}</td>
                                        <td>{new Date(license.renewalDate).toLocaleDateString()}</td>
                                        <td>
                                            <div className="usage-bar-container">
                                                <div
                                                    className="usage-bar"
                                                    style={{
                                                        width: `${license.usage}%`,
                                                        background: getUsageColor(license.usage)
                                                    }}
                                                ></div>
                                                <span className="usage-text">{license.usage}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${getStatusColor(license.status)}`}>
                                                {license.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon" title="Edit">✏️</button>
                                                <button className="btn-icon" title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LicenseInventory;
