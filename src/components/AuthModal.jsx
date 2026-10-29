import React, { useState } from 'react';
import { X, ShieldCheck, User, Globe, Lock, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  role, 
  setRole, 
  currentMember, 
  setCurrentMember, 
  settings, 
  members, 
  t 
}) {
  const [activeTab, setActiveTab] = useState(role === 'admin' ? 'admin' : role === 'member' ? 'member' : 'public');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [memberPhoneInput, setMemberPhoneInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === settings.adminPasscode || adminPasscode.trim() === 'govardhan2026') {
      setRole('admin');
      StorageService.setCurrentRole('admin');
      setSuccess('व्यवस्थापक के रूप में सफलतापूर्वक लॉगिन किया गया!');
      setTimeout(() => {
        onClose();
        setSuccess('');
        setError('');
      }, 700);
    } else {
      setError('अमान्य गुप्त कोड! (डिफ़ॉल्ट कोड: govardhan2026)');
    }
  };

  // Handle Member Lookup / Login
  const handleMemberLogin = (e) => {
    e.preventDefault();
    const clean = memberPhoneInput.replace(/\D/g, '');
    const found = members.find(m => {
      const mClean = m.mobile ? m.mobile.replace(/\D/g, '') : '';
      return (clean.length >= 10 && mClean.endsWith(clean.slice(-10))) ||
        (m.memberId && m.memberId.toLowerCase() === memberPhoneInput.trim().toLowerCase());
    });

    if (found) {
      setRole('member');
      setCurrentMember(found);
      StorageService.setCurrentRole('member');
      StorageService.setCurrentMemberId(found.id);
      setSuccess(`स्वागत है, ${found.name}! आपकी सदस्यता सत्यापित हुई।`);
      setTimeout(() => {
        onClose();
        setSuccess('');
        setError('');
      }, 700);
    } else {
      setError('यह मोबाइल नंबर या सदस्य क्रमांक पंजीकृत नहीं मिला। कृपया समिति संयोजक से संपर्क करें।');
    }
  };

  // Switch to Public
  const handlePublicSwitch = () => {
    setRole('public');
    setCurrentMember(null);
    StorageService.setCurrentRole('public');
    StorageService.setCurrentMemberId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-heading">
              भूमिका एवं लॉगिन चयन (Access & Login)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-amber-50 p-1.5 border-b border-amber-200 text-xs font-bold text-center">
          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-amber-900'
            }`}
          >
            व्यवस्थापक (Admin)
          </button>

          <button
            onClick={() => { setActiveTab('member'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'member' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-amber-900'
            }`}
          >
            सदस्य (Member)
          </button>

          <button
            onClick={() => { setActiveTab('public'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'public' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-amber-900'
            }`}
          >
            श्रद्धालु (Public)
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Admin Tab */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="text-xs text-gray-600">
                व्यवस्थापक को सदस्य जोड़ने, संपादित करने, भुगतान सत्यापन, कार्यक्रम प्रबंधन एवं सेटिंग्स का पूर्ण अधिकार होता है।
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  प्रबंधक गुप्त कोड (Admin Passcode)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="गुप्त कोड दर्ज करें (उदा. govardhan2026)"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  डेमो हेतु डिफ़ॉल्ट कोड: <code className="font-bold text-amber-800">govardhan2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white font-bold text-sm shadow-md transition-all"
              >
                व्यवस्थापक के रूप में प्रवेश करें
              </button>
            </form>
          )}

          {/* Member Tab */}
          {activeTab === 'member' && (
            <form onSubmit={handleMemberLogin} className="space-y-4">
              <div className="text-xs text-gray-600">
                पंजीकृत सदस्य अपना मोबाइल नंबर या सदस्य ID दर्ज कर अपनी भुगतान स्थिति, पावती रसीद एवं सेवा दायित्व देख सकते हैं।
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  पंजीकृत मोबाइल नंबर या सदस्य ID
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. 9876543211 या GPS-2026-001"
                    value={memberPhoneInput}
                    onChange={(e) => setMemberPhoneInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  डेमो सदस्य मोबाइल: <span className="font-mono font-semibold">9876543211</span> (रामेश्वर शर्मा)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white font-bold text-sm shadow-md transition-all"
              >
                सदस्य पोर्टल खोजें व खोलें
              </button>
            </form>
          )}

          {/* Public Tab */}
          {activeTab === 'public' && (
            <div className="space-y-4">
              <div className="text-xs text-gray-600 leading-relaxed">
                अतिथि एवं श्रद्धालु मोड में आप गोवर्धन पूजा कार्यक्रम समय-सारणी, ताज़ा सार्वजनिक सूचनाएं, UPI QR कोड एवं कुल सहयोग आंकड़े देख सकते हैं। सदस्यों की निजी जानकारी सुरक्षित रहती है।
              </div>

              <button
                type="button"
                onClick={handlePublicSwitch}
                className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm shadow transition-all"
              >
                अतिथि / श्रद्धालु के रूप में देखें
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
