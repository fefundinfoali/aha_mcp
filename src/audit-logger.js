// Audit Trail Logger
import fs from 'fs';
import path from 'path';
import os from 'os';

export class AuditLogger {
  constructor(logPath = null) {
    // Default to user's home directory
    this.logDir = logPath || path.join(os.homedir(), '.aha-mcp-audit');
    this.logFile = path.join(this.logDir, 'audit-log.json');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, JSON.stringify({ entries: [] }, null, 2));
    }
  }

  getLogFilePath() {
    return this.logFile;
  }

  async log(entry) {
    const auditEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      data.entries.push(auditEntry);
      fs.writeFileSync(this.logFile, JSON.stringify(data, null, 2));
      return auditEntry;
    } catch (error) {
      console.error('Failed to write audit log:', error);
      return null;
    }
  }

  async logCreate(entityType, entityId, entityName, productId, inputData, responseData) {
    return this.log({
      operation: 'CREATE',
      entityType,
      entityId,
      entityName,
      productId,
      input: inputData,
      result: {
        success: true,
        createdId: responseData?.feature?.reference_num || 
                   responseData?.idea?.reference_num || 
                   responseData?.epic?.reference_num ||
                   responseData?.release?.reference_num ||
                   responseData?.initiative?.reference_num ||
                   responseData?.goal?.reference_num ||
                   responseData?.requirement?.reference_num ||
                   entityId
      }
    });
  }

  async logUpdate(entityType, entityId, entityName, changes, previousValues = null) {
    return this.log({
      operation: 'UPDATE',
      entityType,
      entityId,
      entityName,
      changes,
      previousValues,
      result: { success: true }
    });
  }

  async logDelete(entityType, entityId, entityName) {
    return this.log({
      operation: 'DELETE',
      entityType,
      entityId,
      entityName,
      result: { success: true }
    });
  }

  async logError(operation, entityType, entityId, error) {
    return this.log({
      operation,
      entityType,
      entityId,
      result: {
        success: false,
        error: error.message || String(error)
      }
    });
  }

  async getEntries(filters = {}) {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      let entries = data.entries;

      // Apply filters
      if (filters.operation) {
        entries = entries.filter(e => e.operation === filters.operation.toUpperCase());
      }
      if (filters.entityType) {
        entries = entries.filter(e => e.entityType === filters.entityType);
      }
      if (filters.entityId) {
        entries = entries.filter(e => e.entityId === filters.entityId);
      }
      if (filters.since) {
        const sinceDate = new Date(filters.since);
        entries = entries.filter(e => new Date(e.timestamp) >= sinceDate);
      }
      if (filters.until) {
        const untilDate = new Date(filters.until);
        entries = entries.filter(e => new Date(e.timestamp) <= untilDate);
      }
      if (filters.limit) {
        entries = entries.slice(-filters.limit);
      }

      return entries;
    } catch (error) {
      console.error('Failed to read audit log:', error);
      return [];
    }
  }

  async getStats() {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      const entries = data.entries;

      const stats = {
        totalOperations: entries.length,
        byOperation: {},
        byEntityType: {},
        successCount: 0,
        errorCount: 0,
        firstEntry: entries[0]?.timestamp || null,
        lastEntry: entries[entries.length - 1]?.timestamp || null
      };

      for (const entry of entries) {
        // Count by operation
        stats.byOperation[entry.operation] = (stats.byOperation[entry.operation] || 0) + 1;
        
        // Count by entity type
        stats.byEntityType[entry.entityType] = (stats.byEntityType[entry.entityType] || 0) + 1;
        
        // Count success/error
        if (entry.result?.success) {
          stats.successCount++;
        } else {
          stats.errorCount++;
        }
      }

      return stats;
    } catch (error) {
      console.error('Failed to get audit stats:', error);
      return null;
    }
  }

  async clearLog() {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      const backupFile = path.join(this.logDir, `audit-log-backup-${Date.now()}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
      fs.writeFileSync(this.logFile, JSON.stringify({ entries: [] }, null, 2));
      return { success: true, backupFile };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async exportLog(format = 'json') {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      
      if (format === 'csv') {
        const headers = ['ID', 'Timestamp', 'Operation', 'Entity Type', 'Entity ID', 'Entity Name', 'Success', 'Details'];
        const rows = data.entries.map(e => [
          e.id,
          e.timestamp,
          e.operation,
          e.entityType,
          e.entityId || '',
          e.entityName || '',
          e.result?.success ? 'Yes' : 'No',
          JSON.stringify(e.changes || e.input || e.result?.error || '')
        ]);
        
        const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
        const exportFile = path.join(this.logDir, `audit-export-${Date.now()}.csv`);
        fs.writeFileSync(exportFile, csv);
        return { success: true, file: exportFile, format: 'csv' };
      }
      
      const exportFile = path.join(this.logDir, `audit-export-${Date.now()}.json`);
      fs.writeFileSync(exportFile, JSON.stringify(data, null, 2));
      return { success: true, file: exportFile, format: 'json' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  generateId() {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
