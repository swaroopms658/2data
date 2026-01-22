import { useState, useEffect } from 'react';
import { licenseAPI } from '../services/api';
import LicenseModal from './LicenseModal';
import './LicenseInventory.css';

function LicenseInventory() {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterVendor, setFilterVendor] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLicense, setEditingLicense] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const vendors = ['Microsoft', 'SAP', 'Oracle', 'Salesforce', 'IBM'];

    // Fetch licenses from API
    const fetchLicenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await licenseAPI.getAll();
            setLicenses(response.data);
        } catch (err) {
            setError('Failed to load licenses. Please try again.');
            console.error('Error fetching licenses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    // Filter licenses based on search and filters
    const filteredLicenses = licenses.filter(license => {
        const matchesSearch = license.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            license.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVendor = filterVendor === 'all' || license.vendor === filterVendor;
        const matchesStatus = filterStatus === 'all' || license.status === filterStatus;
        return matchesSearch && matchesVendor && matchesStatus;
    });

    const totalCost = filteredLicenses.reduce((sum, license) => sum + (license.cost || 0), 0);
    const totalQuantity = filteredLicenses.reduce((sum, license) => sum + (license.quantity || 0), 0);

    // Handle add new license
    const handleAdd = () => {
        setEditingLicense(null);
        setIsModalOpen(true);
    };

    // Handle edit license
    const handleEdit = (license) => {
        setEditingLicense(license);
        setIsModalOpen(true);
    };

    // Handle delete license
    const handleDelete = async (id) => {
        try {
            await licenseAPI.delete(id);
            setLicenses(prev => prev.filter(lic => lic._id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            alert('Failed to delete license. Please try again.');
            console.error('Error deleting license:', err);
        }
    };

    // Handle save (add or update)
    const handleSave = async (formData) => {
        try {
            if (editingLicense) {
                // Update existing license
                const response = await licenseAPI.update(editingLicense._id, formData);
                setLicenses(prev => prev.map(lic =>
                    lic._id === editingLicense._id ? response.data : lic
                ));
            } else {
                // Create new license
                const response = await licenseAPI.create(formData);
                setLicenses(prev => [response.data, ...prev]);
            }
            setIsModalOpen(false);
            setEditingLicense(null);
        } catch (err) {
            alert('Failed to save license. Please try again.');
            console.error('Error saving license:', err);
        }
    };

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

    if (loading) {
        return (
            <div className="license-inventory">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading licenses...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="license-inventory">
                <div className="container">
                    <div className="error-state">
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={fetchLicenses}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="license-inventory">
            <div className="container">
                <div className="inventory-header">
                    <div>
                        <h1>License Inventory</h1>
                        <p className="text-secondary">Manage and track all your software licenses</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}>
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
                    {filteredLicenses.length === 0 ? (
                        <div className="empty-state">
                            <p>No licenses found</p>
                            <button className="btn btn-primary" onClick={handleAdd}>
                                Add Your First License
                            </button>
                        </div>
                    ) : (
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
                                        <tr key={license._id}>
                                            <td>
                                                <div className="vendor-cell">
                                                    <span className="vendor-badge">{license.vendor?.charAt(0)}</span>
                                                    <span className="font-semibold">{license.vendor}</span>
                                                </div>
                                            </td>
                                            <td>{license.product}</td>
                                            <td>{license.quantity?.toLocaleString()}</td>
                                            <td className="font-semibold">${license.cost?.toLocaleString()}</td>
                                            <td>{new Date(license.renewalDate).toLocaleDateString()}</td>
                                            <td>
                                                <div className="usage-bar-container">
                                                    <div
                                                        className="usage-bar"
                                                        style={{
                                                            width: `${license.usage || 0}%`,
                                                            background: getUsageColor(license.usage || 0)
                                                        }}
                                                    ></div>
                                                    <span className="usage-text">{license.usage || 0}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${getStatusColor(license.status)}`}>
                                                    {license.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon"
                                                        title="Edit"
                                                        onClick={() => handleEdit(license)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-icon"
                                                        title="Delete"
                                                        onClick={() => setDeleteConfirm(license)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm && (
                    <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Confirm Deletion</h3>
                            <p>Are you sure you want to delete <strong>{deleteConfirm.product}</strong>?</p>
                            <p className="text-secondary">This action cannot be undone.</p>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ background: 'var(--danger)' }}
                                    onClick={() => handleDelete(deleteConfirm._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* License Modal */}
                <LicenseModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingLicense(null);
                    }}
                    onSave={handleSave}
                    license={editingLicense}
                />
            </div>
        </div>
    );
}

export default LicenseInventory;
