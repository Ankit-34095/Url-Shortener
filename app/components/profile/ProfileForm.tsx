'use client';

import React, { useState } from 'react';
import Avatar from '@/components/shared/Avatar';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { useToast } from '@/components/shared/Toast';
import styles from './ProfileForm.module.css';

const ProfileForm = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150');
  const showToast = useToast();

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating profile:', { name, email, avatarUrl });
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
    console.log('Changing password:', { currentPassword, newPassword });
    showToast('Password changed successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <Card className={styles.profileCard}>
      <h2 className={styles.sectionTitle}>Profile Information</h2>
      <form onSubmit={handleProfileUpdate} className={styles.form}>
        <div className={styles.avatarContainer}>
          <Avatar src={avatarUrl} alt="User Avatar" size="lg" />
          <div>
            <p className={styles.userName}>{name}</p>
            <button type="button" className={styles.changeAvatarButton}>Change Avatar</button>
          </div>
        </div>
        <Input label="Full Name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
