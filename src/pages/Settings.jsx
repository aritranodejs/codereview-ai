import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analysisPatterns } from '../services/analysis';

const Settings = () => {
    const { user, logout } = useAuth();
    const [settings, setSettings] = useState({
        notifications: {
            critical: true,
            weekly: true,
            approvals: false
        },
        enabledTypes: ['security', 'bug', 'performance']
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('codereview_settings');
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('codereview_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleType = (type) => {
        setSettings(prev => {
            const types = prev.enabledTypes.includes(type)
                ? prev.enabledTypes.filter(t => t !== type)
                : [...prev.enabledTypes, type];
            return { ...prev, enabledTypes: types };
        });
    };

    return (
        <div className="py-12">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="mb-2">Settings</h1>
                        <p className="text-secondary">Manage your account and preferences</p>
                    </div>
                    {saved && (
                        <div className="badge badge-success animate-fadeIn">
                            Settings Saved! ✅
                        </div>
                    )}
                </div>

                {/* Account */}
                <div className="card mb-6">
                    <h3 className="mb-4">GitHub Account</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="rounded-full"
                            style={{ width: '64px', height: '64px' }}
                        />
                        <div>
                            <div className="font-semibold mb-1">{user.name || user.login}</div>
                            <div className="text-secondary">@{user.login}</div>
                            {user.email && <div className="text-muted" style={{ fontSize: '0.9rem' }}>{user.email}</div>}
                        </div>
                    </div>
                    <button onClick={logout} className="btn btn-secondary">
                        Disconnect GitHub
                    </button>
                </div>

                {/* Subscription */}
                <div className="card mb-6">
                    <h3 className="mb-4">Subscription</h3>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="font-semibold mb-1">Free Plan</div>
                            <div className="text-secondary">Community Edition</div>
                        </div>
                        <span className="badge badge-success">Active</span>
                    </div>

                    <div className="mb-6">
                        <div className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>Usage This Month</div>
                        <div className="mb-2">
                            <div className="flex justify-between mb-1">
                                <span>PRs Reviewed</span>
                                <span className="text-secondary">Unlimited</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card mb-6">
                    <h3 className="mb-4">Notification Preferences</h3>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <div className="font-medium mb-1">Critical Issues Found</div>
                                <div className="text-secondary" style={{ fontSize: '0.9rem' }}>Get notified when critical security issues are detected</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifications.critical}
                                onChange={e => setSettings({ ...settings, notifications: { ...settings.notifications, critical: e.target.checked } })}
                                style={{ width: '20px', height: '20px' }}
                            />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <div className="font-medium mb-1">Weekly Summary</div>
                                <div className="text-secondary" style={{ fontSize: '0.9rem' }}>Receive weekly reports on code quality trends</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifications.weekly}
                                onChange={e => setSettings({ ...settings, notifications: { ...settings.notifications, weekly: e.target.checked } })}
                                style={{ width: '20px', height: '20px' }}
                            />
                        </label>
                    </div>
                </div>

                {/* Coding Standards */}
                <div className="card">
                    <h3 className="mb-4">Coding Standards</h3>
                    <p className="text-secondary mb-4">Customize which rules to enforce in your reviews</p>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enabledTypes.includes('security')}
                                onChange={() => toggleType('security')}
                            />
                            <span>Security vulnerability detection</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enabledTypes.includes('bug')}
                                onChange={() => toggleType('bug')}
                            />
                            <span>Common bug patterns</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enabledTypes.includes('performance')}
                                onChange={() => toggleType('performance')}
                            />
                            <span>Performance optimizations</span>
                        </label>
                    </div>

                    <button onClick={handleSave} className="btn btn-primary mt-6">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
