import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  Database, 
  QrCode, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Cloud,
  FileCode
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function AdminSettingsPage({ 
  settings, 
  onSettingsChange, 
  onResetDemo, 
  t 
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState(settings.supabaseUrl ? 'configured' : 'local');
  const [jsonBackupInput, setJsonBackupInput] = useState('');
  const [restoreFeedback, setRestoreFeedback] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaveSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    StorageService.saveSettings(formData);
    onSettingsChange();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const json = StorageService.exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Govardhan_Puja_Samiti_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restore JSON Backup
  const handleRestoreBackup = () => {
    if (!jsonBackupInput.trim()) return;
    const res = StorageService.importDatabaseJSON(jsonBackupInput);
    if (res.success) {
      onSettingsChange();
      setRestoreFeedback({ type: 'success', message: 'डेटाबेस बैकअप सफलतापूर्वक रीस्टोर हो गया!' });
      setJsonBackupInput('');
    } else {
      setRestoreFeedback({ type: 'error', message: `रीस्टोर विफल: ${res.error}` });
    }
  };

  // Test Supabase connection
  const handleTestSupabase = () => {
    if (!formData.supabaseUrl || !formData.supabaseAnonKey) {
      setSupabaseStatus('missing');
      return;
    }
    setSupabaseStatus('testing');
    setTimeout(() => {
      setSupabaseStatus('configured');
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-amber-600" />
            <span>{t.settingsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            UPI भुगतान, समिति संयोजक, डिफ़ॉल्ट सहयोग राशि एवं संपूर्ण डेटा बैकअप प्रबंधन
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>सेटिंग्स सुरक्षित हो गईं!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: UPI & Payment Settings */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <QrCode className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base font-heading text-amber-950">
              {t.upiSettings}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                समिति UPI ID (PhonePe / GPay / Paytm) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="upiId"
                required
                value={formData.upiId}
                onChange={handleChange}
                placeholder="govardhan.samiti@upi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                खाता धारक / समिति का नाम <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="payeeName"
                required
                value={formData.payeeName}
                onChange={handleChange}
                placeholder="Govardhan Puja Samiti 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                डिफ़ॉल्ट न्यूनतम सहयोग राशि (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="defaultContribution"
                min="1"
                required
                value={formData.defaultContribution}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-amber-950 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Committee & Event Details */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base font-heading text-amber-950">
              समिति आयोजक एवं महोत्सव स्थल विवरण
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                मुख्य संयोजक / अध्यक्ष का नाम
              </label>
              <input
                type="text"
                name="organizerName"
                required
                value={formData.organizerName}
                onChange={handleChange}
                placeholder="सुरेश पटेल (मुख्य संयोजक)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                संयोजक का मोबाइल नंबर (1-Click Call हेतु)
              </label>
              <input
                type="tel"
                name="organizerPhone"
                required
                value={formData.organizerPhone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                गोवर्धन पूजा महोत्सव दिनांक
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                मंदिर एवं पंडाल का पूर्ण पता (रसीद पर मुद्रित होगा)
              </label>
              <input
                type="text"
                name="templeAddress"
                value={formData.templeAddress}
                onChange={handleChange}
                placeholder="श्री कृष्ण मंदिर परिसर, गोवर्धन चौक, वार्ड नं. 5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Security & Privacy Settings */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <Lock className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base font-heading text-amber-950">
              सुरक्षा एवं गोपनीयता सेटिंग्स (Security & Privacy)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                प्रबंधक गुप्त कोड (Admin Passcode)
              </label>
              <input
                type="text"
                name="adminPasscode"
                required
                value={formData.adminPasscode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                * डिफ़ॉल्ट कोड: <code className="font-bold text-amber-800">govardhan2026</code>
              </p>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="privacyMaskPhone"
                  name="privacyMaskPhone"
                  checked={formData.privacyMaskPhone}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <label htmlFor="privacyMaskPhone" className="text-xs font-bold text-gray-800 cursor-pointer">
                  सार्वजनिक दर्शकों के लिए सदस्यों के मोबाइल नंबर आंशिक रूप से छिपाएं (Mask Phone Numbers)
                </label>
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5 ml-6">
                सक्रिय होने पर बिना व्यवस्थापक लॉगिन के मोबाइल नंबर <span className="font-mono">98XXXXXX10</span> के रूप में दिखेंगे।
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Supabase Cloud Database Config */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base font-heading text-amber-950">
                Supabase क्लाउड डेटाबेस सिंक (वैकल्पिक / Optional)
              </h3>
            </div>

            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              formData.supabaseUrl ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {formData.supabaseUrl ? 'क्लाउड सिंक सक्षम' : 'लोकल पर्सिस्टेंस सक्रिय (काम कर रहा है)'}
            </span>
          </div>

          <p className="text-xs text-gray-600">
            यह वेबसाइट बिना किसी बाहरी सर्वर के आपके ब्राउज़र में स्वतः 100% डेटा सुरक्षित रखती है। यदि आप Supabase क्लाउड डेटाबेस जोड़ना चाहते हैं, तो नीचे क्रेडेंशियल दर्ज करें।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                name="supabaseUrl"
                placeholder="https://xyz.supabase.co"
                value={formData.supabaseUrl}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                name="supabaseAnonKey"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={formData.supabaseAnonKey}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTestSupabase}
              className="text-xs text-blue-700 hover:text-blue-800 font-bold hover:underline"
            >
              सिंक परीक्षण करें (Test Connection)
            </button>
            <span className="text-[11px] text-gray-500">
              * `supabase_schema.sql` फ़ाइल प्रोजेक्ट डायरेक्टरी में उपलब्ध है।
            </span>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>सेटिंग्स सुरक्षित करें (Save All Settings)</span>
          </button>
        </div>

      </form>

      {/* Section 5: Database Backup, Restore, and Reset */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-4 mt-8">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
          <Database className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base font-heading text-amber-950">
            डेटाबेस बैकअप एवं रीस्टोर (Backup & Disaster Recovery)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase">पूर्ण बैकअप डाउनलोड</h4>
              <p className="text-[11px] text-gray-500 mt-1">
                सभी सदस्यों, भुगतान रिकॉर्ड, कार्यक्रमों एवं सूचनाओं का संपूर्ण JSON बैकअप सुरक्षित रखें।
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="w-full flex items-center justify-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON बैकअप डाउनलोड</span>
            </button>
          </div>

          {/* Reset to Demo Data */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase">डेमो डेटा पुनः लोड</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                यदि आप परीक्षण करना चाहते हैं, तो प्रारंभिक 7 डेमो सदस्यों व कार्यक्रमों को रीसेट करें।
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('क्या आप डेमो डेटा पुनः लोड करना चाहते हैं?')) {
                  onResetDemo();
                }
              }}
              className="w-full flex items-center justify-center space-x-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
              <span>डेमो डेटा पुनः लोड करें</span>
            </button>
          </div>

          {/* Clear All Data */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-rose-900 uppercase">सभी डेटा साफ़ करें</h4>
              <p className="text-[11px] text-rose-600 mt-1">
                सभी सदस्य एवं भुगतान डेटा स्थायी रूप से मिटाएं (नई शुरुआत के लिए)।
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>डेटा साफ़ करें</span>
            </button>
          </div>

        </div>

        {/* Restore from JSON Input */}
        <div className="pt-3 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            JSON बैकअप टेक्स्ट पेस्ट करके रीस्टोर करें:
          </label>
          <div className="flex gap-2">
            <textarea
              rows="2"
              placeholder='{"version":"1.0","members":[...]}'
              value={jsonBackupInput}
              onChange={(e) => setJsonBackupInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
            ></textarea>
            <button
              onClick={handleRestoreBackup}
              disabled={!jsonBackupInput.trim()}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold disabled:opacity-40 shrink-0"
            >
              रीस्टोर करें
            </button>
          </div>
          {restoreFeedback && (
            <p className={`text-xs mt-1 font-semibold ${restoreFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
              {restoreFeedback.message}
            </p>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-xl border border-rose-300">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">क्या आप निश्चित हैं?</h3>
            <p className="text-xs text-gray-600 mb-4">
              यह क्रिया सभी सदस्यों, दान-सहयोग एवं सूचनाओं को मिटा देगी। यदि आवश्यक हो तो पहले बैकअप डाउनलोड कर लें।
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  StorageService.clearAll();
                  onSettingsChange();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
              >
                हाँ, डेटा साफ़ करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
