import { useState, useEffect } from 'react';

function LicenseModal({ isOpen, onClose, onSave, license = null }) {
    const [formData, setFormData] = useState({
        vendor: '',
        product: '',
        quantity: '',
        cost: '',
        renewalDate: '',
        status: 'active',
        usage: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (license) {
            setFormData({
                vendor: license.vendor || '',
                product: license.product || '',
                quantity: license.quantity || '',
                cost: license.cost || '',
                renewalDate: license.renewalDate ? license.renewalDate.split('T')[0] : '',
                status: license.status || 'active',
                usage: license.usage || '',
                notes: license.notes || ''
            });
        } else {
            setFormData({
                vendor: '',
                product: '',
                quantity: '',
                cost: '',
                renewalDate: '',
                status: 'active',
                usage: '',
                notes: ''
            });
        }
        setErrors({});
    }, [license, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.vendor) newErrors.vendor = 'Vendor is required';
        if (!formData.product) newErrors.product = 'Product is required';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
        if (!formData.cost || formData.cost < 0) newErrors.cost = 'Valid cost is required';
        if (!formData.renewalDate) newErrors.renewalDate = 'Renewal date is required';
        if (formData.usage && (formData.usage < 0 || formData.usage > 100)) {
            newErrors.usage = 'Usage must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);

        const dataToSave = {
            ...formData,
            quantity: parseInt(formData.quantity),
            cost: parseFloat(formData.cost),
            usage: formData.usage ? parseInt(formData.usage) : 0
        };

        try {
            await onSave(dataToSave);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {license ? 'Edit License' : 'Add New License'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all transform hover:rotate-90"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Vendor */}
                        <div>
                            <label htmlFor="vendor" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Vendor *
                            </label>
                            <select
                                id="vendor"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                className={`input ${errors.vendor ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Vendor</option>
                                <option value="Microsoft">Microsoft</option>
                                <option value="SAP">SAP</option>
                                <option value="Oracle">Oracle</option>
                                <option value="Salesforce">Salesforce</option>
                                <option value="IBM">IBM</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
                        </div>

                        {/* Product */}
                        <div>
                            <label htmlFor="product" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                id="product"
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                placeholder="e.g., Microsoft 365 E5"
                                className={`input ${errors.product ? 'border-red-500' : ''}`}
                            />
                            {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                placeholder="100"
                                className={`input ${errors.quantity ? 'border-red-500' : ''}`}
                            />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>

                        {/* Cost */}
                        <div>
                            <label htmlFor="cost" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Monthly Cost ($) *
                            </label>
                            <input
                                type="number"
                                id="cost"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="10000"
                                className={`input ${errors.cost ? 'border-red-500' : ''}`}
                            />
                            {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
                        </div>

                        {/* Renewal Date */}
                        <div>
                            <label htmlFor="renewalDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Renewal Date *
                            </label>
                            <input
                                type="date"
                                id="renewalDate"
                                name="renewalDate"
                                value={formData.renewalDate}
                                onChange={handleChange}
                                className={`input ${errors.renewalDate ? 'border-red-500' : ''}`}
                            />
                            {errors.renewalDate && <p className="text-red-500 text-xs mt-1">{errors.renewalDate}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="active">Active</option>
                                <option value="expiring">Expiring Soon</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        {/* Usage */}
                        <div>
                            <label htmlFor="usage" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Usage % (0-100)
                            </label>
                            <input
                                type="number"
                                id="usage"
                                name="usage"
                                value={formData.usage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                placeholder="75"
                                className={`input ${errors.usage ? 'border-red-500' : ''}`}
                            />
                            {errors.usage && <p className="text-red-500 text-xs mt-1">{errors.usage}</p>}
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Additional notes about this license..."
                                rows="3"
                                className="input"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="btn btn-secondary disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                license ? 'Update License' : 'Add License'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LicenseModal;
