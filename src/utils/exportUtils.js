export const downloadCSV = (data, filename) => {
    if (!data || !data.length) {
        console.warn('No data to export');
        alert('No data available to export.');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(header => {
            let value = row[header];

            // Handle null/undefined
            if (value === null || value === undefined) {
                return '';
            }

            // Handle objects (convert to string)
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }

            // Handle strings with commas or quotes
            if (typeof value === 'string') {
                // Escape quotes and wrap in quotes if contains comma or quote
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
            }

            return value;
        }).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
