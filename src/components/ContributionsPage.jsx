import React, { useState } from 'react';
import { 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storage';
import { playTempleBell } from '../utils/soundEffects';

export default function ContributionsPage({ 
  members, 
  onMembersChange, 
  onViewReceipt, 
  onOpenUpi, 
  settings, 
  role, 
  t 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [quickUpdateMember, setQuickUpdateMember] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Stats calculation
  const totalMembers = members.length;
  const paidMembers = members.filter(m => m.paymentStatus === 'paid').length;
  const partialMembers = members.filter(m => m.paymentStatus === 'partially_paid').length;
  const pendingMembers = members.filter(m => m.paymentStatus === 'pending').length;

  const totalExpected = members.reduce((sum, m) => sum + (Number(m.contributionRequired) || 0), 0);
  const totalCollected = members.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0);
  const totalRemaining = members.reduce((sum, m) => sum + (Number(m.balance) || 0), 0);
  const progressPercent = totalExpected > 0 ? Math.min(100, Math.round((totalCollected / totalExpected) * 100)) : 0;

  // Filtered members
  const filtered = members.filter(m => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (m.name && m.name.toLowerCase().includes(term)) ||
      (m.mobile && m.mobile.includes(term)) ||
      (m.memberId && m.memberId.toLowerCase().includes(term));
    const matchStatus = statusFilter === 'all' || m.paymentStatus === statusFilter;
    const matchMethod = methodFilter === 'all' || m.paymentMethod === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  // Verify payment action
  const handleVerifyPayment = (memberId) => {
    StorageService.verifyPayment(memberId, true);
    onMembersChange();
    playTempleBell();
    
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f59e0b', '#10b981', '#fbbf24']
    });
  };

  // Quick Mark as Paid modal submit
  const handleQuickPaySubmit = (e) => {
    e.preventDefault();
    if (!quickUpdateMember) return;

    const amountPaid = Number(quickUpdateMember.newPaidAmount);
    const required = Number(quickUpdateMember.contributionRequired || 7);
    const balance = Math.max(0, required - amountPaid);
    const status = amountPaid >= required ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'pending';

    StorageService.updateMember(quickUpdateMember.id, {
      amountPaid,
      balance,
      paymentStatus: status,
      paymentMethod: quickUpdateMember.paymentMethod || 'upi',
      paymentVerified: true,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: quickUpdateMember.newTxnRef || ''
    });

    onMembersChange();
    playTempleBell();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    setQuickUpdateMember(null);
  };

  // Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Export Financial CSV
  const handleExportFinancialCsv = () => {
    const headers = ['Receipt No,Member ID,Member Name,Mobile,Required (INR),Paid (INR),Balance (INR),Status,Verified,Mode,Payment Date,Transaction Ref\n'];
    const rows = members.map(m => 
      `"GPS-REC-${m.memberId?.replace('GPS-', '') || '2026'}","${m.memberId || ''}","${m.name || ''}","${m.mobile || ''}",${m.contributionRequired || 7},${m.amountPaid || 0},${m.balance || 0},"${m.paymentStatus || ''}","${m.paymentVerified ? 'Yes' : 'No'}","${m.paymentMethod || ''}","${m.paymentDate || ''}","${m.transactionRef || ''}"`
    );

    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Govardhan_Puja_Contributions_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <IndianRupee className="w-6 h-6 text-amber-600" />
            <span>{t.contributionsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            प्रत्येक सदस्य न्यूनतम ₹7 सहयोग या इच्छानुसार दान कर सकते हैं। सभी प्रविष्टियां रसीद सहित संधारित हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenUpi}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>UPI QR कोड व खाता</span>
          </button>

          <button
            onClick={handleExportFinancialCsv}
            className="flex items-center space-x-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
            title="संपूर्ण दान-सहयोग रिपोर्ट एक्सेल/CSV में डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span>वित्तीय रिपोर्ट CSV</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards Required in Section 3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Registered Members */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/70 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">कुल सदस्य</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading mt-1">
            {totalMembers}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">पंजीकृत</div>
        </div>

        {/* 2. Paid Members */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/70 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">पूर्ण भुगतान सदस्य</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading mt-1">
            {paidMembers}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">सत्यापित सहयोग</div>
        </div>

        {/* 3. Pending Members */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200/70 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">बकाया सदस्य</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-heading mt-1">
            {pendingMembers}
          </div>
          <div className="text-[11px] text-rose-600 mt-1">
            {partialMembers > 0 ? `+${partialMembers} आंशिक` : 'अदत्त'}
          </div>
        </div>

        {/* 4. Expected Collection */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200/70 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">कुल अपेक्षित राशि</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-heading mt-1">
            ₹{totalExpected}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">₹7 न्यूनतम प्रति सदस्य</div>
        </div>

        {/* 5. Total Collected */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-2xl border border-amber-300 shadow-sm">
          <div className="text-xs text-amber-800 font-bold">कुल प्राप्त सहयोग</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-heading mt-1">
            ₹{totalCollected}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            {progressPercent}% संकलित
          </div>
        </div>

        {/* 6. Remaining Amount */}
        <div className="bg-white p-4 rounded-2xl border border-orange-200/70 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">कुल शेष बकाया</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-800 font-heading mt-1">
            ₹{totalRemaining}
          </div>
          <div className="text-[11px] text-orange-600 mt-1">संग्रह शेष</div>
        </div>
      </div>

      {/* UPI Info Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl p-4 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-600 font-medium">समिति अधिकृत UPI ID (PhonePe / GPay / Paytm):</div>
            <div className="font-mono text-sm sm:text-base font-bold text-amber-950">{settings.upiId}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyUpi}
            className="flex items-center space-x-1.5 bg-white hover:bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 shadow-sm transition-all"
          >
            {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
            <span>{copiedUpi ? 'कॉपी हो गया!' : 'UPI ID कॉपी करें'}</span>
          </button>

          <button
            onClick={onOpenUpi}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            QR कोड दिखाएं
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="नाम, मोबाइल या रसीद क्रमांक से खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
          >
            <option value="all">सभी स्थितियां</option>
            <option value="paid">पूर्ण भुगतान</option>
            <option value="partially_paid">आंशिक</option>
            <option value="pending">बकाया</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
          >
            <option value="all">सभी माध्यम</option>
            <option value="upi">UPI</option>
            <option value="cash">नकद (Cash)</option>
          </select>
        </div>
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
              <tr>
                <th className="px-4 py-3">रसीद क्र. / सदस्य</th>
                <th className="px-4 py-3">मोबाइल</th>
                <th className="px-4 py-3 text-right">अपेक्षित (₹)</th>
                <th className="px-4 py-3 text-right">प्राप्त (₹)</th>
                <th className="px-4 py-3 text-right">शेष (₹)</th>
                <th className="px-4 py-3 text-center">माध्यम</th>
                <th className="px-4 py-3 text-center">भुगतान स्थिति</th>
                <th className="px-4 py-3 text-center">सत्यापन स्थिति</th>
                <th className="px-4 py-3 text-center">कार्यवाही / रसीद</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map(member => (
                  <tr key={member.id} className="hover:bg-amber-50/40 transition-colors">
                    
                    {/* Name & ID */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-gray-900">{member.name}</div>
                      <div className="font-mono text-xs text-amber-700">
                        {member.memberId || 'GPS-2026'}
                      </div>
                      {member.transactionRef && (
                        <div className="text-[11px] font-mono text-gray-500 truncate max-w-[150px]">
                          Ref: {member.transactionRef}
                        </div>
                      )}
                    </td>

                    {/* Mobile */}
                    <td className="px-4 py-3.5 font-mono text-gray-700 whitespace-nowrap">
                      {settings.privacyMaskPhone && role !== 'admin'
                        ? member.mobile.slice(0, 2) + 'XXXXXX' + member.mobile.slice(-2)
                        : member.mobile}
                    </td>

                    {/* Required */}
                    <td className="px-4 py-3.5 text-right font-medium text-gray-800">
                      ₹{member.contributionRequired || 7}
                    </td>

                    {/* Paid */}
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-700">
                      ₹{member.amountPaid || 0}
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-3.5 text-right font-bold text-rose-600">
                      ₹{member.balance !== undefined ? member.balance : Math.max(0, (member.contributionRequired || 7) - (member.amountPaid || 0))}
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className="font-semibold text-xs uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {member.paymentMethod === 'upi' ? 'UPI' : 'नकद'}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        member.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : member.paymentStatus === 'partially_paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {member.paymentStatus === 'paid' ? 'पूर्ण' : member.paymentStatus === 'partially_paid' ? 'आंशिक' : 'बकाया'}
                      </span>
                    </td>

                    {/* Verification Status (Section 3 Requirement) */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {member.paymentVerified ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>सत्यापित</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-700 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>सत्यापन प्रतीक्षारत</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        
                        {/* Admin Payment Verification Action Button */}
                        {role === 'admin' && !member.paymentVerified && Number(member.amountPaid) > 0 && (
                          <button
                            onClick={() => handleVerifyPayment(member.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm transition-all flex items-center space-x-1"
                            title="व्यवस्थापक द्वारा भुगतान सत्यापित करें"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>सत्यापित करें</span>
                          </button>
                        )}

                        {/* Quick Record Payment Button for Pending/Partial */}
                        {role === 'admin' && member.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => setQuickUpdateMember({
                              ...member,
                              newPaidAmount: member.contributionRequired || 7,
                              newTxnRef: ''
                            })}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                            title="सहयोग राशि दर्ज करें"
                          >
                            जमा दर्ज करें
                          </button>
                        )}

                        {/* Printable Receipt */}
                        {(Number(member.amountPaid) > 0 || member.paymentStatus === 'paid') && (
                          <button
                            onClick={() => onViewReceipt(member)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                            title="पावती रसीद देखें व प्रिंट करें"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                    कोई रिकॉर्ड नहीं मिला
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Record Payment Modal */}
      {quickUpdateMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border-2 border-amber-400">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              सहयोग भुगतान दर्ज करें
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              सदस्य: <strong>{quickUpdateMember.name}</strong> ({quickUpdateMember.memberId})
            </p>

            <form onSubmit={handleQuickPaySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  प्राप्त राशि (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quickUpdateMember.newPaidAmount}
                  onChange={(e) => setQuickUpdateMember({ ...quickUpdateMember, newPaidAmount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold text-emerald-700 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  भुगतान माध्यम
                </label>
                <select
                  value={quickUpdateMember.paymentMethod || 'upi'}
                  onChange={(e) => setQuickUpdateMember({ ...quickUpdateMember, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white font-medium"
                >
                  <option value="upi">UPI (PhonePe / GPay / Paytm)</option>
                  <option value="cash">नकद (Cash)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  UPI Ref / UTR / रसीद क्र. (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. UPI/261029/982341"
                  value={quickUpdateMember.newTxnRef}
                  onChange={(e) => setQuickUpdateMember({ ...quickUpdateMember, newTxnRef: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setQuickUpdateMember(null)}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold shadow"
                >
                  जमा दर्ज करें व सत्यापित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
