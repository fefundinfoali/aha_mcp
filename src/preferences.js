import fs from 'fs';
import path from 'path';
import os from 'os';

// Store prefs in the same folder as the audit log
const PREFS_DIR = process.env.AUDIT_LOG_PATH || path.join(os.homedir(), '.aha-mcp-audit');
const PREFS_FILE = path.join(PREFS_DIR, 'prefs.json');

// Ensure directory exists
if (!fs.existsSync(PREFS_DIR)) {
  fs.mkdirSync(PREFS_DIR, { recursive: true });
}

export const preferences = {
  set: (key, value) => {
    try {
      let data = {};
      if (fs.existsSync(PREFS_FILE)) {
        data = JSON.parse(fs.readFileSync(PREFS_FILE, 'utf8'));
      }
      data[key] = value;
      fs.writeFileSync(PREFS_FILE, JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.error("Error saving preference:", e);
      return false;
    }
  },

  get: (key) => {
    try {
      if (fs.existsSync(PREFS_FILE)) {
        const data = JSON.parse(fs.readFileSync(PREFS_FILE, 'utf8'));
        return data[key];
      }
      return null;
    } catch (e) {
      return null;
    }
  }
};