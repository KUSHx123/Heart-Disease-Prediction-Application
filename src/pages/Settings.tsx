import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Globe, 
  Eye, 
  Mail, 
  LogOut, 
  RefreshCw, 
  Laptop, 
  Smartphone,
  AlertTriangle,
  Check,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { 
  LoginActivity, 
  NotificationPreferences, 
  VisibilitySettings,
  SocialLinks 
} from '../types';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(true);
  const [showTcUpdate, setShowTcUpdate] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    profileVisibility: 'private',
    activityHistory: true,
    lastSeen: true
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    marketing: true,
    securityAlerts: true,
    updates: true,
    appointments: true,
    predictions: true
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    linkedin: '',
    github: '',
    twitter: ''
  });

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadLoginActivity();
    loadUserPreferences();
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setPushNotificationsEnabled(permission === 'granted');
    }
  };

  const loadLoginActivity = async () => {
    setIsLoadingActivity(true);
    try {
      const { data, error } = await supabase
        .from('login_activity')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      setLoginActivity(data || []);
    } catch (err) {
      console.error('Error loading login activity:', err);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences, social_links')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setVisibilitySettings(data.preferences?.visibility || visibilitySettings);
        setNotificationPreferences(data.preferences?.notifications || notificationPreferences);
        setSocialLinks(data.social_links || socialLinks);
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      await signOut();
    } catch (err) {
      console.error('Error logging out from all devices:', err);
    }
  };

  const validateSocialLink = (url: string, platform: keyof SocialLinks) => {
    if (!url) return true;
    const patterns = {
      linkedin: /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
      github: /^https:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
      twitter: /^https:\/\/(www\.)?twitter\.com\/[\w-]+\/?$/
    };
    return patterns[platform].test(url);
  };

  const handleSocialLinksUpdate = async () => {
    for (const [platform, url] of Object.entries(socialLinks)) {
      if (url && !validateSocialLink(url, platform as keyof SocialLinks)) {
        alert(`Invalid ${platform} URL format`);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ social_links: socialLinks })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating social links:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Login Activity Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Login Activity</h2>
            <button
              onClick={loadLoginActivity}
              className="text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          
          {isLoadingActivity ? (
            <div className="flex justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {loginActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {activity.deviceType === 'mobile' ? (
                      <Smartphone className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Laptop className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <p className="font-medium">{activity.browser}</p>
                      <p className="text-sm text-gray-500">{activity.location} • {activity.ipAddress}</p>
                      <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  {activity.isCurrentSession && (
                    <span className="text-green-600 text-sm">Current Session</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visibility Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Visibility Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                value={visibilitySettings.profileVisibility}
                onChange={(e) => setVisibilitySettings({
                  ...visibilitySettings,
                  profileVisibility: e.target.value as VisibilitySettings['profileVisibility']
                })}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Only Friends</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Activity History</label>
                <p className="text-sm text-gray-500">Show your activity history to others</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibilitySettings.activityHistory}
                  onChange={(e) => setVisibilitySettings({
                    ...visibilitySettings,
                    activityHistory: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Last Seen Status</label>
                <p className="text-sm text-gray-500">Show when you were last active</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibilitySettings.lastSeen}
                  onChange={(e) => setVisibilitySettings({
                    ...visibilitySettings,
                    lastSeen: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Browser Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications when you're using the web app
              </p>
            </div>
            <button
              onClick={requestNotificationPermission}
              disabled={notificationPermission === 'denied'}
              className={`px-4 py-2 rounded-md ${
                pushNotificationsEnabled
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {notificationPermission === 'denied'
                ? 'Notifications Blocked'
                : pushNotificationsEnabled
                ? 'Enabled'
                : 'Enable'}
            </button>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
          <div className="space-y-4">
            {Object.entries(notificationPreferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive notifications about {key.toLowerCase()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationPreferences({
                      ...notificationPreferences,
                      [key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="h-5 w-5 inline-block mr-2" />
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Github className="h-5 w-5 inline-block mr-2" />
                GitHub Profile
              </label>
              <input
                type="url"
                value={socialLinks.github}
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                placeholder="https://github.com/username"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Twitter className="h-5 w-5 inline-block mr-2" />
                Twitter Profile
              </label>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                placeholder="https://twitter.com/username"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSocialLinksUpdate}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Social Links
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        {showTcUpdate && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                Our Terms & Conditions have been updated. Please review and accept the changes.
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowTcUpdate(false)}
                className="text-gray-700 hover:text-gray-900"
              >
                Later
              </button>
              <button
                onClick={() => {
                  setTcAccepted(true);
                  setShowTcUpdate(false);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {/* Logout from All Devices */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout from All Devices
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Logout from All Devices
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to log out from all devices? You'll need to sign in again on each device.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutAllDevices}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Logout All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;