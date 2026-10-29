import React, { useState } from 'react';
import { X, UserPlus, AlertTriangle, CheckCircle, IndianRupee } from 'lucide-react';
import { StorageService } from '../services/storage';

export default function AddMemberModal({ isOpen, onClose, onMemberAdded, defaultContribution = 7, t }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    contributionRequired: defaultContribution,
    amountPaid: defaultContribution,
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    transactionRef: '',
    notes: '',
    consentPublic: true
  });

  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      
      // Auto adjust paymentStatus when amounts change
      if (name === 'amountPaid' || name === 'contributionRequired') {
        const req = Number(name === 'contributionRequired' ? val : prev.contributionRequired);
        const paid = Number(name === 'amountPaid' ? val : prev.amountPaid);
        if (paid >= req && req > 0) {
          updated.paymentStatus = 'paid';
        } else if (paid > 0 && paid < req) {
          updated.paymentStatus = 'partially_paid';
        } else {
          updated.paymentStatus = 'pending';
        }
      }

      return updated;
    });

    if (error) setError('');
    if (duplicateWarning) setDuplicateWarning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      setError('कृपया सदस्य का पूरा नाम दर्ज करें (Please enter full name).');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('कृपया सही 10-अंकीय मोबाइल नंबर दर्ज करें (Valid 10-digit mobile number required).');
      return;
    }

    // Check duplicate
    const isDup = StorageService.checkDuplicate(cleanMobile, formData.name);
    if (isDup && !duplicateWarning) {
      setDuplicateWarning(true);
      setError('चेतावनी: इस मोबाइल नंबर या नाम से सदस्य पहले से पंजीकृत है! यदि आप फिर भी जोड़ना चाहते हैं तो दोबारा क्लिक करें।');
      return;
    }

    // Add member
    const newMember = StorageService.addMember(formData);
    onMemberAdded(newMember);
    onClose();

    // Reset Form
    setFormData({
      name: '',
      mobile: '',
      address: '',
      contributionRequired: defaultContribution,
      amountPaid: defaultContribution,
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      transactionRef: '',
      notes: '',
      consentPublic: true
    });
    setError('');
    setDuplicateWarning(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold font-heading">
              नया सदस्य पंजीकरण (Add New Member)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-semibold ${
              duplicateWarning ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              पूरा नाम (Full Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="उदा. रमेश कुमार शर्मा"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              मोबाइल नंबर (10 Digits Mobile Number) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-500 text-sm font-medium">+91</span>
              <input
                type="tel"
                name="mobile"
                required
                maxLength="10"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono"
              />
            </div>
          </div>

          {/* Locality / Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              गाँव / मोहल्ला / पता (Village / Locality / Address)
            </label>
            <input
              type="text"
              name="address"
              placeholder="उदा. वार्ड 4, हनुमान मंदिर के पास"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          {/* Contribution & Amount Paid in Two Columns */}
          <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                सहयोग राशि (₹ Required)
              </label>
              <input
                type="number"
                name="contributionRequired"
                min="1"
                value={formData.contributionRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 text-sm font-bold text-amber-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                जमा राशि (₹ Paid)
              </label>
              <input
                type="number"
                name="amountPaid"
                min="0"
                value={formData.amountPaid}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 text-sm font-bold text-emerald-800"
              />
            </div>

            {/* Calculated Balance Preview */}
            <div className="col-span-2 flex justify-between items-center text-xs px-1 text-gray-600">
              <span>शेष बकाया (Balance):</span>
              <span className="font-bold text-rose-600">
                ₹{Math.max(0, Number(formData.contributionRequired) - Number(formData.amountPaid))}
              </span>
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                भुगतान माध्यम (Mode)
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 text-sm bg-white"
              >
                <option value="upi">UPI (PhonePe / GPay / Paytm)</option>
                <option value="cash">नकद (Cash)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                भुगतान स्थिति (Status)
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 text-sm bg-white font-medium"
              >
                <option value="paid">पूर्ण भुगतान (Paid)</option>
                <option value="partially_paid">आंशिक (Partially Paid)</option>
                <option value="pending">बकाया (Pending)</option>
              </select>
            </div>
          </div>

          {/* Transaction Ref / UTR (Optional) */}
          {formData.paymentMethod === 'upi' && Number(formData.amountPaid) > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                UPI लेनदेन संख्या / UTR (वैकल्पिक)
              </label>
              <input
                type="text"
                name="transactionRef"
                placeholder="उदा. UPI/261029/987123"
                value={formData.transactionRef}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-mono"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              टिप्पणी / दायित्व (Notes / Volunteer Duty - Optional)
            </label>
            <textarea
              name="notes"
              rows="2"
              placeholder="उदा. पूजा सजावट दल, शाम को नकद देंगे, आदि..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 text-sm"
            ></textarea>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="consentPublic"
              name="consentPublic"
              checked={formData.consentPublic}
              onChange={handleChange}
              className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
            />
            <label htmlFor="consentPublic" className="text-xs text-gray-600 cursor-pointer">
              सदस्य का नाम सार्वजनिक सहयोग सूची में प्रदर्शित करने की सहमति है
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-colors"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-md transition-all"
            >
              {duplicateWarning ? 'फिर भी जोड़ें (Confirm Add)' : '+ सदस्य जोड़ें'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
