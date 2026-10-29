import React, { useState } from 'react';
import { X, QrCode, Copy, Check, ExternalLink, IndianRupee, HeartHandshake, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storage';
import { playTempleBell } from '../utils/soundEffects';

export default function UpiModal({ isOpen, onClose, settings, onPaymentLogged, t }) {
  const [amount, setAmount] = useState(7);
  const [copied, setCopied] = useState(false);
  
  // Quick Report Form
  const [showReportForm, setShowReportForm] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorMobile, setDonorMobile] = useState('');
  const [txnRef, setTxnRef] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const upiLink = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Govardhan Puja 2026 Sahyog')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickReport = (e) => {
    e.preventDefault();
    if (!donorName.trim() || donorMobile.length < 10) return;

    // Add member or record payment
    const newEntry = StorageService.addMember({
      name: donorName,
      mobile: donorMobile,
      contributionRequired: amount,
      amountPaid: amount,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      paymentVerified: false, // will await admin verification
      transactionRef: txnRef || `UPI-${Date.now().toString().slice(-6)}`,
      notes: 'ऑनलाइन UPI सहयोग - पावती सत्यापन प्रतीक्षारत'
    });

    onPaymentLogged();
    playTempleBell();
    confetti({ particleCount: 70, spread: 60 });
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      setShowReportForm(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-heading">
              UPI ऑनलाइन सहयोग (Scan & Pay)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-center">
          
          {/* Amount Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              सहयोग राशि चुनें या दर्ज करें (Select Amount):
            </label>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              {[7, 21, 51, 101, 501, 1100].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    amount === val
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <div className="relative max-w-[160px] mx-auto">
              <span className="absolute left-3 top-2 font-bold text-gray-500">₹</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 1)}
                className="w-full pl-8 pr-3 py-1.5 text-center font-bold text-amber-950 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 text-base"
              />
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 inline-block shadow-inner">
            <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border-2 border-dashed border-amber-400 flex items-center justify-center">
              <img
                src={qrUrl}
                alt="Govardhan Puja UPI QR"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs font-bold text-amber-950 mt-2 truncate">
              {settings.payeeName}
            </p>
            <p className="text-[11px] font-mono text-gray-600 truncate">
              {settings.upiId}
            </p>
          </div>

          {/* Copy and Direct App Link */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
              <span>{copied ? 'कॉपी हो गया!' : 'UPI ID कॉपी करें'}</span>
            </button>

            {/* Mobile Deep Link */}
            <a
              href={upiLink}
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>UPI ऐप में खोलें (Pay Now)</span>
            </a>
          </div>

          {/* Already Paid Confirmation Trigger */}
          <div className="pt-3 border-t border-gray-100">
            {!showReportForm ? (
              <button
                onClick={() => setShowReportForm(true)}
                className="text-xs text-amber-800 font-bold hover:underline"
              >
                ✓ मैंने भुगतान कर दिया है, रसीद हेतु विवरण दर्ज करें
              </button>
            ) : (
              <form onSubmit={handleQuickReport} className="text-left bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2.5">
                <h4 className="text-xs font-bold text-amber-950">
                  भुगतान विवरण दर्ज करें (रसीद सत्यापन हेतु)
                </h4>

                {successMsg && (
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>विवरण दर्ज हो गया! समिति द्वारा सत्यापित होने पर रसीद जारी होगी।</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700">आपका नाम</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राजेश कुमार"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700">मोबाइल नंबर (10 अंक)</label>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="9876543210"
                    value={donorMobile}
                    onChange={(e) => setDonorMobile(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700">UPI Ref / UTR (वैकल्पिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. 439281729381"
                    value={txnRef}
                    onChange={(e) => setTxnRef(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-3 py-1 rounded text-xs text-gray-600"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow"
                  >
                    जमा दर्ज करें
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
