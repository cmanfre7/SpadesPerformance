"use client";

import { useState, useEffect } from 'react';
import { adminStore, AdminSettings } from '@/lib/admin-store';

export function SettingsManager() {
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: 'Spades Performance',
    siteUrl: 'https://spadesdenver.club',
    contactEmail: 'contact@spadesdenver.club',
    socialLinks: {
      instagram: '',
      tiktok: '',
      youtube: '',
    },
    maintenanceMode: false,
    allowNewMembers: true,
    requireApproval: true,
  });
  const [saved, setSaved] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);

  useEffect(() => {
    setSettings(adminStore.getSettings());
  }, []);

  const handleSave = () => {
    adminStore.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = adminStore.exportAllData();
    const json = JSON.stringify(data, null, 2);
    setExportData(json);
  };

  const handleDownload = () => {
    const data = adminStore.exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spades-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('This will replace all your current data. Are you sure?')) {
          adminStore.importAllData(data);
          alert('Data imported successfully! Please refresh the page.');
          window.location.reload();
        }
      } catch {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('This will DELETE ALL your data and reset to defaults. This cannot be undone. Are you absolutely sure?')) {
      if (confirm('Last chance! Type "RESET" in the next prompt to confirm.')) {
        const confirmation = prompt('Type RESET to confirm:');
        if (confirmation === 'RESET') {
          adminStore.resetAllData();
          alert('All data has been reset. Refreshing...');
          window.location.reload();
        }
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-white/40 text-sm mt-1">Site configuration and data management.</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2 font-bold text-sm rounded-lg transition-all ${
            saved 
              ? 'bg-green-500 text-white scale-105' 
              : 'bg-spades-gold text-black hover:bg-spades-gold/90'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Site Info */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">🌐 Site Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Site URL</label>
              <input
                type="text"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">📱 Social Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.socialLinks.instagram}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/spades_performance"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">TikTok URL</label>
              <input
                type="text"
                value={settings.socialLinks.tiktok}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialLinks: { ...settings.socialLinks, tiktok: e.target.value }
                })}
                placeholder="https://tiktok.com/@spadesperformance"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">YouTube URL</label>
              <input
                type="text"
                value={settings.socialLinks.youtube}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                })}
                placeholder="https://youtube.com/@spadesperformance"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Site Behavior */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">⚙️ Site Behavior</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-white font-medium">Maintenance Mode</div>
                <div className="text-white/40 text-xs">Show "Coming Soon" to visitors</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-white font-medium">Allow New Members</div>
                <div className="text-white/40 text-xs">Accept join requests</div>
              </div>
              <input
                type="checkbox"
                checked={settings.allowNewMembers}
                onChange={(e) => setSettings({ ...settings, allowNewMembers: e.target.checked })}
                className="w-5 h-5 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-white font-medium">Require Approval</div>
                <div className="text-white/40 text-xs">Review marketplace listings before going live</div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">💾 Data Management</h3>
          <div className="space-y-4">
            <div>
              <p className="text-white/50 text-sm mb-3">
                Export all your data as a backup file that you can restore later.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 bg-blue-500/20 text-blue-400 font-bold text-sm rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  📥 Download Backup
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  👁 View Data
                </button>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/50 text-sm mb-3">
                Restore from a previous backup file.
              </p>
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="py-2 bg-green-500/20 text-green-400 font-bold text-sm rounded-lg hover:bg-green-500/30 transition-colors text-center cursor-pointer">
                  📤 Import Backup
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export Data View */}
      {exportData && (
        <div className="mt-6 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">📋 Export Data</h3>
            <button
              onClick={() => setExportData(null)}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
          <pre className="bg-black/50 p-4 rounded-lg overflow-auto max-h-96 text-xs text-green-400 font-mono">
            {exportData}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(exportData);
              alert('Copied to clipboard!');
            }}
            className="mt-4 px-4 py-2 bg-spades-gold/20 text-spades-gold font-bold text-sm rounded-lg hover:bg-spades-gold/30 transition-colors"
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}

      {/* Danger Zone */}
      <div className="mt-6 bg-red-500/10 rounded-xl p-6 border border-red-500/20">
        <h3 className="text-lg font-bold text-red-400 mb-4">⚠️ Danger Zone</h3>
        <p className="text-white/50 text-sm mb-4">
          These actions are irreversible. Make sure you have a backup before proceeding.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500/20 text-red-400 font-bold text-sm rounded-lg hover:bg-red-500/30 transition-colors"
        >
          🗑 Reset All Data
        </button>
      </div>

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Settings Tips</h4>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• <strong>Maintenance Mode</strong> hides the site from visitors while you make changes</li>
          <li>• <strong>Download backups regularly</strong> to avoid losing your data</li>
          <li>• <strong>Import</strong> restores all events, members, merch, etc. from a backup file</li>
          <li>• Data is stored in your browser - clearing browser data will erase it!</li>
        </ul>
      </div>
    </div>
  );
}

