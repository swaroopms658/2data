import { useState, useEffect } from 'react';
import './LicenseModal.css';

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

    useEffect(() => {
        if (license) {
            // Edit mode - populate form with existing data
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
            // Add mode - reset form
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
        // Clear error for this field
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Convert strings to numbers where needed
        const dataToSave = {
            ...formData,
            quantity: parseInt(formData.quantity),
            cost: parseFloat(formData.cost),
            usage: formData.usage ? parseInt(formData.usage) : 0
        };

        onSave(dataToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{license ? 'Edit License' : 'Add New License'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="vendor">Vendor *</label>
                            <select
                                id="vendor"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                className={errors.vendor ? 'error' : ''}
                            >
                                <option value="">Select Vendor</option>
                                <option value="Microsoft">Microsoft</option>
                                <option value="SAP">SAP</option>
                                <option value="Oracle">Oracle</option>
                                <option value="Salesforce">Salesforce</option>
                                <option value="IBM">IBM</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.vendor && <span className="error-text">{errors.vendor}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="product">Product Name *</label>
                            <input
                                type="text"
                                id="product"
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                placeholder="e.g., Microsoft 365 E5"
                                className={errors.product ? 'error' : ''}
                            />
                            {errors.product && <span className="error-text">{errors.product}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity *</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                placeholder="100"
                                className={errors.quantity ? 'error' : ''}
                            />
                            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cost">Monthly Cost ($) *</label>
                            <input
                                type="number"
                                id="cost"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="10000"
                                className={errors.cost ? 'error' : ''}
                            />
                            {errors.cost && <span className="error-text">{errors.cost}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="renewalDate">Renewal Date *</label>
                            <input
                                type="date"
                                id="renewalDate"
                                name="renewalDate"
                                value={formData.renewalDate}
                                onChange={handleChange}
                                className={errors.renewalDate ? 'error' : ''}
                            />
                            {errors.renewalDate && <span className="error-text">{errors.renewalDate}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status *</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="expiring">Expiring Soon</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="usage">Usage % (0-100)</label>
                            <input
                                type="number"
                                id="usage"
                                name="usage"
                                value={formData.usage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                placeholder="75"
                                className={errors.usage ? 'error' : ''}
                            />
                            {errors.usage && <span className="error-text">{errors.usage}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Additional notes about this license..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {license ? 'Update License' : 'Add License'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LicenseModal;
