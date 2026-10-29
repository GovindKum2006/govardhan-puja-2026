import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  TrendingUp, 
  Award,
  MapPin
} from 'lucide-react';

export default function ReportsPage({ members, settings, t }) {
  // Financial calculations
  const totalMembers = members.length;
  const paidMembers = members.filter(m => m.paymentStatus === 'paid').length;
  const partialMembers = members.filter(m => m.paymentStatus === 'partially_paid').length;
  const pendingMembers = members.filter(m => m.paymentStatus === 'pending').length;

  const totalExpected = members.reduce((sum, m) => sum + (Number(m.contributionRequired) || 0), 0);
  const totalCollected = members.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0);
  const totalRemaining = members.reduce((sum, m) => sum + (Number(m.balance) || 0), 0);

  const upiMembers = members.filter(m => m.paymentMethod === 'upi');
  const cashMembers = members.filter(m => m.paymentMethod === 'cash');

  const upiCollected = upiMembers.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0);
  const cashCollected = cashMembers.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0);

  const completionPercent = totalExpected > 0 ? Math.min(100, Math.round((totalCollected / totalExpected) * 100)) : 0;
  const paidPercent = totalMembers > 0 ? Math.round((paidMembers / totalMembers) * 100) : 0;

  // Export Full CSV
  const handleDownloadFullReport = () => {
    const headers = ['Serial,Receipt No,Member ID,Full Name,Mobile,Locality/Address,Required (INR),Paid (INR),Balance (INR),Status,Payment Mode,Transaction Ref,Date,Notes\n'];
    const rows = members.map((m, idx) => 
      `${idx + 1},"GPS-REC-${m.memberId?.replace('GPS-', '') || '2026'}","${m.memberId || ''}","${m.name || ''}","${m.mobile || ''}","${m.address || ''}",${m.contributionRequired || 7},${m.amountPaid || 0},${m.balance || 0},"${m.paymentStatus || ''}","${m.paymentMethod || ''}","${m.transactionRef || ''}","${m.paymentDate || ''}","${(m.notes || '').replace(/"/g, '""')}"`
    );

    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Govardhan_Puja_Full_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="no-print bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-amber-600" />
            <span>समिति वित्तीय एवं सदस्यता रिपोर्ट (Reports & Audit)</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            श्री गोवर्धन पूजा महोत्सव 2026 की विस्तृत वित्तीय ऑडिट रिपोर्ट एवं डाउनलोड
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadFullReport}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>CSV संपूर्ण रिपोर्ट डाउनलोड</span>
          </button>

          <button
            onClick={handlePrintAudit}
            className="flex items-center space-x-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>ऑडिट शीट प्रिंट करें</span>
          </button>
        </div>
      </div>

      {/* Audit Sheet Container */}
      <div id="printable-receipt" className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        
        {/* Official Header for Print */}
        <div className="text-center pb-4 border-b-2 border-amber-500">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-950">
            {settings.payeeName}
          </h1>
          <p className="text-xs text-amber-800 font-medium">
            {settings.templeAddress} | अधिकृत वार्षिक लेखा-जोखा
          </p>
          <div className="mt-2 inline-block bg-amber-100 text-amber-900 border border-amber-400 px-4 py-0.5 rounded-full text-xs font-bold uppercase">
            गोवर्धन पूजा 2026 - आय एवं सहयोग सारांश
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <div className="text-xs text-gray-500 font-medium">कुल सदस्य संख्या</div>
            <div className="text-2xl font-extrabold text-amber-900 font-heading mt-1">{totalMembers}</div>
            <div className="text-[11px] text-gray-500">{paidPercent}% सदस्यों ने भुगतान किया</div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <div className="text-xs text-emerald-700 font-medium">कुल संकलित राशि</div>
            <div className="text-2xl font-extrabold text-emerald-800 font-heading mt-1">₹{totalCollected}</div>
            <div className="text-[11px] text-emerald-600">{completionPercent}% लक्ष्य प्राप्त</div>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
            <div className="text-xs text-blue-700 font-medium">कुल अपेक्षित लक्ष्य</div>
            <div className="text-2xl font-extrabold text-blue-900 font-heading mt-1">₹{totalExpected}</div>
            <div className="text-[11px] text-blue-600">न्यूनतम ₹7 प्रति सदस्य आधार</div>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
            <div className="text-xs text-rose-700 font-medium">शेष बकाया राशि</div>
            <div className="text-2xl font-extrabold text-rose-800 font-heading mt-1">₹{totalRemaining}</div>
            <div className="text-[11px] text-rose-600">{pendingMembers} सदस्यों से शेष</div>
          </div>
        </div>

        {/* Payment Modes Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">
              UPI ऑनलाइन भुगतान सारांश
            </h3>
            <div className="flex justify-between items-center text-sm py-1 border-b border-gray-200">
              <span className="text-gray-600">UPI प्रदाता सदस्य:</span>
              <span className="font-bold">{upiMembers.length} सदस्य</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1 border-b border-gray-200">
              <span className="text-gray-600">UPI द्वारा प्राप्त राशि:</span>
              <span className="font-bold text-emerald-700">₹{upiCollected}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 text-gray-500">
              <span>समिति UPI खाता:</span>
              <span className="font-mono">{settings.upiId}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">
              नकद (Cash) भुगतान सारांश
            </h3>
            <div className="flex justify-between items-center text-sm py-1 border-b border-gray-200">
              <span className="text-gray-600">नकद सहयोगदाता सदस्य:</span>
              <span className="font-bold">{cashMembers.length} सदस्य</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1 border-b border-gray-200">
              <span className="text-gray-600">नकद प्राप्त राशि:</span>
              <span className="font-bold text-emerald-700">₹{cashCollected}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 text-gray-500">
              <span>कोषाध्यक्ष अभिरक्षा:</span>
              <span>{settings.organizerName}</span>
            </div>
          </div>
        </div>

        {/* Member Contributions Summary Table */}
        <div>
          <h3 className="text-sm font-bold text-amber-950 mb-3 uppercase tracking-wider">
            सदस्यवार विवरण (Member Contributions Table)
          </h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2">क्रमांक</th>
                  <th className="px-3 py-2">सदस्य ID</th>
                  <th className="px-3 py-2">नाम</th>
                  <th className="px-3 py-2">मोबाइल</th>
                  <th className="px-3 py-2 text-right">अपेक्षित (₹)</th>
                  <th className="px-3 py-2 text-right">प्राप्त (₹)</th>
                  <th className="px-3 py-2 text-right">शेष (₹)</th>
                  <th className="px-3 py-2 text-center">माध्यम</th>
                  <th className="px-3 py-2 text-center">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono text-amber-800">{m.memberId}</td>
                    <td className="px-3 py-2 font-bold text-gray-900">{m.name}</td>
                    <td className="px-3 py-2 font-mono text-gray-600">{m.mobile}</td>
                    <td className="px-3 py-2 text-right">₹{m.contributionRequired || 7}</td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-700">₹{m.amountPaid || 0}</td>
                    <td className="px-3 py-2 text-right font-bold text-rose-600">₹{m.balance || 0}</td>
                    <td className="px-3 py-2 text-center uppercase">{m.paymentMethod}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {m.paymentStatus === 'paid' ? 'पूर्ण' : 'बकाया'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Signatures */}
        <div className="pt-8 border-t border-gray-300 flex justify-between items-end text-xs text-gray-600">
          <div>
            <p>रिपोर्ट तैयार करने का दिनांक: {new Date().toLocaleDateString('hi-IN')}</p>
            <p>प्रणाली: Govardhan Puja Samiti Smart Portal 2026</p>
          </div>

          <div className="text-right space-y-8">
            <div className="border-b border-gray-400 w-44 inline-block"></div>
            <div>
              <p className="font-bold text-gray-800">{settings.organizerName}</p>
              <p>मुख्य संयोजक / कोषाध्यक्ष अधिकृत हस्ताक्षर</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
