import crypto from 'crypto';

// In-memory per-user preferences
// Keyed by a hash of the user's AHA token so each person gets their own defaults
const userPrefs = new Map();

function userKey(token) {
  if (!token) return '__global__';
  return crypto.createHash('sha256').update(token).digest('hex').substring(0, 16);
}

export const preferences = {
  set: (key, value, token) => {
    try {
      const uid = userKey(token);
      if (!userPrefs.has(uid)) userPrefs.set(uid, {});
      userPrefs.get(uid)[key] = value;
      return true;
    } catch (e) {
      console.error('Error saving preference:', e);
      return false;
    }
  },

  get: (key, token) => {
    try {
      const uid = userKey(token);
      if (userPrefs.has(uid)) {
        return userPrefs.get(uid)[key] || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
};
