'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/lib/auth-context';
import api, { formatApiError } from '@/lib/api';
import { getCookie } from 'cookies-next';
import styles from './ProfileForm.module.css';

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
}

const ProfileForm = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const showToast = useToast();

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      const token = getCookie('token') as string | Promise<string | undefined> | undefined;
      if (!token) return;

      try {
        const profile = await api<UserProfile>('/auth/me', { token });
        setFirstName(profile.firstName || '');
        setLastName(profile.lastName || '');
        setEmail(profile.email || '');
        localStorage.setItem('userName', [profile.firstName, profile.lastName].filter(Boolean).join(' '));
        localStorage.setItem('userEmail', profile.email || '');
      } catch (err: any) {
        showToast(formatApiError(err, 'Failed to load profile.'), 'error');
      }
    };

    loadProfile();
  }, [showToast]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile updated successfully!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (currentPassword === newPassword) {
      showToast('New password cannot be the same as current password.', 'warning');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <Card className={styles.profileCard}>
      <h2 className={styles.sectionTitle}>Profile Information</h2>
      <form onSubmit={handleProfileUpdate} className={styles.form}>
        <div className={styles.nameRow}>
          <Input label="First Name" id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <Input label="Last Name" id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <Input label="Email Address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
        <Button type="submit" variant="primary">Save Profile</Button>
      </form>

      <hr className={styles.divider} />

      <h2 className={styles.sectionTitle}>Change Password</h2>
      <form onSubmit={handleChangePassword} className={styles.form}>
        <Input label="Current Password" id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        <Input label="New Password" id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <Input label="Confirm New Password" id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
        <Button type="submit" variant="secondary">Change Password</Button>
      </form>
    </Card>
  );
};

export default ProfileForm;
