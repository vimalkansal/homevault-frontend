import api, { downloadFile } from './api';

export const exportService = {
  /**
   * Export items to CSV file
   */
  async exportToCSV(): Promise<void> {
    await downloadFile('/export/items/csv', `homevault-items-${new Date().toISOString()}.csv`);
  },

  /**
   * Export items to JSON file
   */
  async exportToJSON(): Promise<void> {
    await downloadFile('/export/items/json', `homevault-items-${new Date().toISOString()}.json`);
  },

  /**
   * Get export download URL
   */
  getExportUrl(format: 'csv' | 'json'): string {
    const token = localStorage.getItem('token');
    return `${api.defaults.baseURL}/export/items/${format}${token ? `?token=${token}` : ''}`;
  }
};
