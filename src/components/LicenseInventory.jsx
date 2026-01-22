import { useState, useEffect } from 'react';
import { licenseAPI } from '../services/api';
import { downloadCSV } from '../utils/exportUtils';
import LicenseModal from './LicenseModal';

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
    const [deleting, setDeleting] = useState(false);

    const vendors = ['Microsoft', 'SAP', 'Oracle', 'Salesforce', 'IBM'];

    const fetchLicenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await licenseAPI.getAll();
            setLicenses(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
            setError(`Failed to load licenses: ${errorMessage}`);
            console.error('Error fetching licenses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    const filteredLicenses = licenses.filter(license => {
        const matchesSearch = license.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            license.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVendor = filterVendor === 'all' || license.vendor === filterVendor;
        const matchesStatus = filterStatus === 'all' || license.status === filterStatus;
        return matchesSearch && matchesVendor && matchesStatus;
    });

    const totalCost = filteredLicenses.reduce((sum, license) => sum + (license.cost || 0), 0);
    const totalQuantity = filteredLicenses.reduce((sum, license) => sum + (license.quantity || 0), 0);

    const handleAdd = () => {
        setEditingLicense(null);
        setIsModalOpen(true);
    };

    const handleEdit = (license) => {
        setEditingLicense(license);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);
            await licenseAPI.delete(id);
            setLicenses(prev => prev.filter(lic => lic._id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            alert('Failed to delete license. Please try again.');
            console.error('Error deleting license:', err);
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingLicense) {
                const response = await licenseAPI.update(editingLicense._id, formData);
                setLicenses(prev => prev.map(lic =>
                    lic._id === editingLicense._id ? response.data : lic
                ));
            } else {
                const response = await licenseAPI.create(formData);
                setLicenses(prev => [response.data, ...prev]);
            }
            setIsModalOpen(false);
            setEditingLicense(null);
        } catch (err) {
            alert('Failed to save license. Please try again.');
            console.error('Error saving license:', err);
            throw err;
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
        if (usage >= 80) return 'bg-green-500';
        if (usage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading licenses...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-16">
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <button onClick={fetchLicenses} className="btn btn-primary">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">License Inventory</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all your software licenses</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => downloadCSV(licenses, 'license_inventory.csv')}
                            className="btn btn-secondary"
                        >
                            <span>📄</span>
                            Export CSV
                        </button>
                        <button onClick={handleAdd} className="btn btn-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add License
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Licenses</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {filteredLicenses.length}
                        </p>
                    </div>
                    <div className="card text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Quantity</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {totalQuantity.toLocaleString()}
                        </p>
                    </div>
                    <div className="card text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Monthly Cost</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${(totalCost / 1000).toFixed(1)}K
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="🔍 Search licenses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vendor</label>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
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
                </div>

                {/* License Table */}
                <div className="card">
                    {filteredLicenses.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">No licenses found</p>
                            <button onClick={handleAdd} className="btn btn-primary">
                                Add Your First License
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Monthly Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Renewal Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Usage</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredLicenses.map(license => (
                                        <tr key={license._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {license.vendor?.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{license.vendor}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{license.product}</td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{license.quantity?.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">${license.cost?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{new Date(license.renewalDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className={`h-full ${getUsageColor(license.usage || 0)} transition-all`} style={{ width: `${license.usage || 0}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">{license.usage || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`badge badge-${getStatusColor(license.status)}`}>
                                                    {license.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(license)}
                                                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors group"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(license)}
                                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors group"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
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

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => !deleting && setDeleteConfirm(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                Are you sure you want to delete <strong>{deleteConfirm.product}</strong>?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting}
                                    className="btn btn-secondary disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm._id)}
                                    disabled={deleting}
                                    className="btn btn-danger disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
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
