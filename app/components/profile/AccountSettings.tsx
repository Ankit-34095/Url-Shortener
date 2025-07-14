'use client';

import React, { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { useToast } from '@/components/shared/Toast';
import styles from './AccountSettings.module.css';

const AccountSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultExpiration, setDefaultExpiration] = useState('30');
  const [apiKey, setApiKey] = useState('sk_xxxxxxxxxxxxxxxxxxxx'); // Mock API Key
  const showToast = useToast();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', { notificationsEnabled, defaultExpiration });
    showToast('Settings saved successfully!', 'success');
  };

  const handleGenerateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substring(2, 20); // Simulate new API key
    setApiKey(newKey);
    showToast('New API Key generated!', 'info');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
      showToast('Account deleted (mock action).', 'error');
      // In a real app, trigger logout and navigate to landing page
    }
  };

  return (
    <Card className={styles.accountSettingsCard}>
      <h2 className={styles.sectionTitle}>Account Settings</h2>
      <form onSubmit={handleSaveSettings} className={styles.form}>
        <div>
          <label className={styles.label}>Notifications</label>
          <div className={styles.toggleContainer}>
            <label htmlFor="toggle-notifications" className={styles.toggleLabel}>
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle-notifications"
                  className={styles.toggleInput}
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
                <div className={styles.toggleSwitch}></div>
                <div className={styles.toggleDot}
                  style={notificationsEnabled ? { transform: 'translateX(100%)', backgroundColor: '#2563eb' } : {}}></div>
              </div>
              <div className={styles.toggleText}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="defaultExpiration" className={styles.label}>Default URL Expiration</label>
          <select
            id="defaultExpiration"
            className={styles.selectField}
            value={defaultExpiration}
            onChange={(e) => setDefaultExpiration(e.target.value)}
          >
            <option value="0">Never</option>
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>

        <Button type="submit" variant="primary">Save Settings</Button>
      </form>

      <hr className={styles.divider} />

      <h2 className={styles.sectionTitle}>API Key</h2>
      <div className={styles.form}>
        <Input label="Your API Key" id="apiKey" type="text" value={apiKey} disabled />
        <Button onClick={handleGenerateApiKey} variant="secondary">Generate New Key</Button>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.dangerTitle}>Danger Zone</h2>
      <div className={styles.dangerZone}>
        <div>
          <p className={styles.dangerText}>Delete Account</p>
          <p className={styles.dangerSubtext}>Permanently delete your account and all associated data.</p>
        </div>
        <Button onClick={handleDeleteAccount} variant="danger">Delete Account</Button>
      </div>
    </Card>
  );
};

export default AccountSettings;
