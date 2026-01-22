import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for production
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// License API endpoints
export const licenseAPI = {
    // Get all licenses with optional filters
    getAll: (params = {}) => apiClient.get('/licenses', { params }),

    // Get single license by ID
    getById: (id) => apiClient.get(`/licenses/${id}`),

    // Create new license
    create: (data) => apiClient.post('/licenses', data),

    // Update existing license
    update: (id, data) => apiClient.put(`/licenses/${id}`, data),

    // Delete license
    delete: (id) => apiClient.delete(`/licenses/${id}`),

    // Get licenses by vendor
    getByVendor: (vendor) => apiClient.get(`/licenses/vendor/${vendor}`),
};

// Analytics API endpoints
export const analyticsAPI = {
    // Get cost summary statistics
    getCostSummary: () => apiClient.get('/analytics/cost-summary'),

    // Get usage trends by vendor
    getUsageTrends: () => apiClient.get('/analytics/usage-trends'),

    // Get vendor comparison data
    getVendorComparison: () => apiClient.get('/analytics/vendor-comparison'),

    // Get optimization opportunities
    getOpportunities: () => apiClient.get('/analytics/optimization-opportunities'),
};

// Export axios instance for custom requests if needed
export default apiClient;
