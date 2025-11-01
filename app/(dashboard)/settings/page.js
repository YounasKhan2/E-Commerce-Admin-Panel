'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderUpdates: true,
        lowStockAlerts: true,
        customerMessages: true,
        weeklyReports: false,
    });

    // Appearance settings
    const [appearance, setAppearance] = useState({
        theme: 'dark',
        compactMode: false,
        sidebarCollapsed: false,
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Implement profile update with Appwrite
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement password change with Appwrite
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast.success('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            toast.error('Failed to change password');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setLoading(true);

        try {
            // TODO: Save notification preferences
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success('Notification preferences updated!');
        } catch (error) {
            toast.error('Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleAppearanceUpdate = async () => {
        setLoading(true);

        try {
            // TODO: Save appearance preferences
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success('Appearance settings updated!');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Manage your account settings and preferences"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Settings */}
                    <Card title="Profile Information">
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <Input
                                label="Full Name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                placeholder="Enter your full name"
                                icon="person"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                placeholder="Enter your email"
                                icon="email"
                                disabled
                                helperText="Email cannot be changed"
                            />

                            <div className="flex justify-end">
                                <Button type="submit" loading={loading}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Password Change */}
                    <Card title="Change Password">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <Input
                                label="Current Password"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                                icon="lock"
                                required
                            />

                            <Input
                                label="New Password"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Enter new password"
                                icon="lock"
                                helperText="Must be at least 8 characters"
                                required
                            />

                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                                icon="lock"
                                required
                            />

                            <div className="flex justify-end">
                                <Button type="submit" loading={loading} variant="secondary">
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Notification Preferences */}
                    <Card title="Notification Preferences">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Email Notifications</p>
                                    <p className="text-slate-400 text-xs">Receive email notifications for important updates</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifications}
                                        onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Order Updates</p>
                                    <p className="text-slate-400 text-xs">Get notified when orders are placed or updated</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.orderUpdates}
                                        onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Low Stock Alerts</p>
                                    <p className="text-slate-400 text-xs">Receive alerts when products are running low</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.lowStockAlerts}
                                        onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Customer Messages</p>
                                    <p className="text-slate-400 text-xs">Get notified about new support tickets</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.customerMessages}
                                        onChange={(e) => setNotifications({ ...notifications, customerMessages: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Weekly Reports</p>
                                    <p className="text-slate-400 text-xs">Receive weekly performance reports via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.weeklyReports}
                                        onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleNotificationUpdate} loading={loading}>
                                    Save Preferences
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Account Info */}
                    <Card title="Account Information">
                        <div className="space-y-3">
                            <div>
                                <p className="text-slate-400 text-xs">Account ID</p>
                                <p className="text-white text-sm font-mono">{user?.$id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs">Member Since</p>
                                <p className="text-white text-sm">
                                    {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs">Email Verified</p>
                                <p className="text-white text-sm">
                                    {user?.emailVerification ? '✓ Verified' : '✗ Not Verified'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Appearance */}
                    <Card title="Appearance">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Theme
                                </label>
                                <select
                                    value={appearance.theme}
                                    onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                                    className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    disabled
                                >
                                    <option value="dark">Dark (Default)</option>
                                    <option value="light">Light (Coming Soon)</option>
                                </select>
                                <p className="text-slate-400 text-xs mt-1">Currently only dark theme is available</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Compact Mode</p>
                                    <p className="text-slate-400 text-xs">Reduce spacing for more content</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={appearance.compactMode}
                                        onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                                        className="sr-only peer"
                                        disabled
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50"></div>
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleAppearanceUpdate} loading={loading} disabled>
                                    Coming Soon
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card title="Danger Zone">
                        <div className="space-y-3">
                            <p className="text-slate-400 text-xs">
                                These actions are permanent and cannot be undone.
                            </p>
                            <Button variant="danger" className="w-full" disabled>
                                Delete Account
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
