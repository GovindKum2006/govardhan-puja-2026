import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  PhoneCall, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Edit3, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  LayoutGrid, 
  Table as TableIcon,
  X,
  Check
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function MembersManagement({ 
  members, 
  onMembersChange, 
  onAddMember, 
  onViewReceipt, 
  role, 
  settings, 
  t 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [csvFeedback, setCsvFeedback] = useState(null);

  // Filtered members list
  const filteredMembers = members.filter(member => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (member.name && member.name.toLowerCase().includes(term)) ||
      (member.mobile && member.mobile.includes(term)) ||
      (member.memberId && member.memberId.toLowerCase().includes(term)) ||
      (member.address && member.address.toLowerCase().includes(term));
    
    const matchesStatus = 
      statusFilter === 'all' || 
      member.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    
    StorageService.updateMember(editingMember.id, editingMember);
    onMembersChange();
    setEditingMember(null);
  };

  // Handle Delete
  const handleDeleteMember = (id) => {
    StorageService.deleteMember(id);
    onMembersChange();
    setDeleteConfirmId(null);
  };

  // Export Members to CSV
  const handleExportCsv = () => {
    const headers = ['MemberID,Full Name,Mobile,Locality/Address,Required (INR),Paid (INR),Balance (INR),Status,Payment Mode,Transaction Ref,Date,Notes\n'];
    const rows = members.map(m => 
      `"${m.memberId || ''}","${m.name || ''}","${m.mobile || ''}","${m.address || ''}",${m.contributionRequired || 7},${m.amountPaid || 0},${m.balance || 0},"${m.paymentStatus || ''}","${m.paymentMethod || ''}","${m.transactionRef || ''}","${m.paymentDate || ''}","${(m.notes || '').replace(/"/g, '""')}"`
    );
    
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Govardhan_Puja_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const sample = `Full Name,Mobile,Address,Contribution Required,Amount Paid,Payment Mode,Notes
रमेश शर्मा,9876543210,वार्ड 4 मंदिर मार्ग,7,7,upi,पूजा व्यवस्थापक
सुरेश यादव,9876543211,यादव मोहल्ला,7,0,cash,भंडारा सेवा
दिनेश गुप्ता,9876543212,बाजार चौक,21,21,upi,विशेष भोग सहयोग`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Govardhan_Puja_Sample_Members_Import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process CSV Import
  const handleProcessCsvImport = () => {
    if (!csvContent.trim()) {
      setCsvFeedback({ type: 'error', message: 'कृपया CSV सामग्री दर्ज करें या फ़ाइल चुनें।' });
      return;
    }

    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        setCsvFeedback({ type: 'error', message: 'CSV में कम से कम एक सदस्य डेटा पंक्ति होनी चाहिए।' });
        return;
      }

      let addedCount = 0;
      let duplicateCount = 0;

      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple comma split handling quotes
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const name = cols[0];
        const mobile = cols[1];
        const address = cols[2] || '';
        const req = Number(cols[3]) || 7;
        const paid = Number(cols[4]) || 0;
        const mode = cols[5] ? cols[5].toLowerCase() : 'upi';
        const notes = cols[6] || '';

        if (!name || !mobile) continue;

        // Check if duplicate
        if (StorageService.checkDuplicate(mobile, name)) {
          duplicateCount++;
          continue;
        }

        StorageService.addMember({
          name,
          mobile,
          address,
          contributionRequired: req,
          amountPaid: paid,
          paymentMethod: mode.includes('cash') ? 'cash' : 'upi',
          notes
        });
        addedCount++;
      }

      onMembersChange();
      setCsvFeedback({
        type: 'success',
        message: `सफलतापूर्वक ${addedCount} सदस्य जोड़े गए। ${duplicateCount > 0 ? `(${duplicateCount} डुप्लिकेट सदस्य छोड़ दिए गए)` : ''}`
      });
      setCsvContent('');
    } catch (err) {
      setCsvFeedback({ type: 'error', message: `CSV प्रसंस्करण त्रुटि: ${err.message}` });
    }
  };

  // Read File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target.result);
      setCsvFeedback(null);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Main Actions */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-600" />
            <span>{t.membersDirectory} ({members.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            श्री गोवर्धन पूजा समिति 2026 के सभी सदस्यों की सूची, संपर्क एवं सहयोग स्थिति
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {role === 'admin' && (
            <>
              <button
                onClick={onAddMember}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ नया सदस्य</span>
              </button>

              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
                title="CSV से कई सदस्य एक साथ जोड़ें"
              >
                <Upload className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">CSV आयात (Import)</span>
                <span className="sm:hidden">Import</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-3 py-2 rounded-xl text-xs shadow-sm transition-all"
            title="सदस्य सूची CSV फाइल में डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span>CSV निर्यात</span>
          </button>

          {/* Toggle Table / Grid */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'table' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500'}`}
              title="तालिका व्यू (Table)"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'grid' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500'}`}
              title="कार्ड ग्रिड व्यू (Cards)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="नाम, मोबाइल, सदस्य क्रमांक या मोहल्ला खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-gray-500 flex items-center space-x-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>फ़िल्टर:</span>
          </span>
          {[
            { id: 'all', label: 'सभी' },
            { id: 'paid', label: 'पूर्ण भुगतान' },
            { id: 'partially_paid', label: 'आंशिक' },
            { id: 'pending', label: 'बकाया' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members List - Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                <tr>
                  <th className="px-4 py-3">सदस्य क्रमांक</th>
                  <th className="px-4 py-3">नाम व पता</th>
                  <th className="px-4 py-3">मोबाइल नंबर</th>
                  <th className="px-4 py-3 text-right">सहयोग राशि</th>
                  <th className="px-4 py-3 text-right">जमा राशि</th>
                  <th className="px-4 py-3 text-right">शेष</th>
                  <th className="px-4 py-3 text-center">स्थिति</th>
                  <th className="px-4 py-3 text-center">कॉल / रसीद</th>
                  {role === 'admin' && <th className="px-4 py-3 text-center">प्रबंधन</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <tr key={member.id} className="hover:bg-amber-50/40 transition-colors">
                      {/* Member ID */}
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-amber-800 whitespace-nowrap">
                        {member.memberId || 'GPS-2026'}
                      </td>

                      {/* Name & Address */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900">{member.name}</div>
                        {member.address && (
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {member.address}
                          </div>
                        )}
                        {member.notes && (
                          <div className="text-[11px] text-amber-700 italic mt-0.5">
                            {member.notes}
                          </div>
                        )}
                      </td>

                      {/* Mobile */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-gray-700 font-medium">
                          {settings.privacyMaskPhone && role !== 'admin'
                            ? member.mobile.slice(0, 2) + 'XXXXXX' + member.mobile.slice(-2)
                            : member.mobile}
                        </span>
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

                      {/* Payment Status Badge */}
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

                      {/* Call & Receipt */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Call Button */}
                          <a
                            href={`tel:+91${member.mobile}`}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                            title="सदस्य को कॉल करें"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          {/* Receipt Button */}
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

                      {/* Admin Actions */}
                      {role === 'admin' && (
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => setEditingMember(member)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                              title="संपादित करें"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(member.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                              title="हटाएं"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role === 'admin' ? 9 : 8} className="px-4 py-12 text-center text-gray-500">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-semibold">कोई सदस्य नहीं मिला (No members match your criteria)</p>
                      <p className="text-xs text-gray-400 mt-1">खोज शब्द बदलें या नया सदस्य जोड़ें।</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <div 
              key={member.id}
              className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {member.memberId || 'GPS-2026'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    member.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : member.paymentStatus === 'partially_paid'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {member.paymentStatus === 'paid' ? 'पूर्ण भुगतान' : member.paymentStatus === 'partially_paid' ? 'आंशिक' : 'बकाया'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-xs text-gray-600 flex items-center space-x-1 mb-2">
                  <span>📱</span>
                  <span className="font-mono">
                    {settings.privacyMaskPhone && role !== 'admin'
                      ? member.mobile.slice(0, 2) + 'XXXXXX' + member.mobile.slice(-2)
                      : member.mobile}
                  </span>
                </div>

                {member.address && (
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    📍 {member.address}
                  </p>
                )}

                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 grid grid-cols-3 gap-1 text-center my-2">
                  <div>
                    <div className="text-[10px] text-gray-500 font-medium">अपेक्षित</div>
                    <div className="text-xs font-bold text-gray-800">₹{member.contributionRequired || 7}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-700 font-medium">प्राप्त</div>
                    <div className="text-xs font-bold text-emerald-700">₹{member.amountPaid || 0}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-600 font-medium">शेष</div>
                    <div className="text-xs font-bold text-rose-600">
                      ₹{member.balance !== undefined ? member.balance : Math.max(0, (member.contributionRequired || 7) - (member.amountPaid || 0))}
                    </div>
                  </div>
                </div>

                {member.notes && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg italic border border-amber-200/40 mb-2">
                    {member.notes}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:+91${member.mobile}`}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>कॉल करें</span>
                </a>

                <div className="flex items-center space-x-2">
                  {(Number(member.amountPaid) > 0 || member.paymentStatus === 'paid') && (
                    <button
                      onClick={() => onViewReceipt(member)}
                      className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>रसीद</span>
                    </button>
                  )}

                  {role === 'admin' && (
                    <button
                      onClick={() => setEditingMember(member)}
                      className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
                    >
                      संपादित करें
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                सदस्य विवरण संपादन (Edit Member)
              </h3>
              <button onClick={() => setEditingMember(null)} className="p-1 rounded hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">पूरा नाम</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">मोबाइल नंबर</label>
                <input
                  type="tel"
                  required
                  value={editingMember.mobile}
                  onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">गाँव / मोहल्ला</label>
                <input
                  type="text"
                  value={editingMember.address || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">सहयोग राशि (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingMember.contributionRequired}
                    onChange={(e) => setEditingMember({ ...editingMember, contributionRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">जमा राशि (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingMember.amountPaid}
                    onChange={(e) => setEditingMember({ ...editingMember, amountPaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">भुगतान स्थिति</label>
                  <select
                    value={editingMember.paymentStatus}
                    onChange={(e) => setEditingMember({ ...editingMember, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                  >
                    <option value="paid">पूर्ण (Paid)</option>
                    <option value="partially_paid">आंशिक (Partial)</option>
                    <option value="pending">बकाया (Pending)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">माध्यम</label>
                  <select
                    value={editingMember.paymentMethod}
                    onChange={(e) => setEditingMember({ ...editingMember, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">नकद (Cash)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">टिप्पणी</label>
                <input
                  type="text"
                  value={editingMember.notes || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow"
                >
                  सुरक्षित करें (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-xl border border-rose-300">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">सदस्य हटाएं?</h3>
            <p className="text-xs text-gray-600 mb-4">
              क्या आप वाकई इस सदस्य को सूची से हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                onClick={() => handleDeleteMember(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
              >
                हटाएं (Confirm Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base font-heading">
                  CSV फाइल से कई सदस्य जोड़ें (Bulk Import)
                </h3>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="p-1 rounded hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold mb-1">CSV कॉलम क्रम (Headers format):</p>
                <code className="block bg-white p-2 rounded border border-amber-300 font-mono text-[11px] overflow-x-auto">
                  Full Name,Mobile,Address,Contribution Required,Amount Paid,Payment Mode,Notes
                </code>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="text-xs text-amber-700 hover:underline font-bold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>नमूना CSV फ़ाइल डाउनलोड करें (Sample Template)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  CSV फाइल चुनें (.csv)
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  या सीधे CSV टेक्स्ट यहाँ पेस्ट करें:
                </label>
                <textarea
                  rows="5"
                  placeholder="Full Name,Mobile,Address,Contribution Required,Amount Paid,Payment Mode,Notes&#10;रमेश शर्मा,9876543210,मंदिर मार्ग,7,7,upi,व्यवस्थापक"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              {csvFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  csvFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  {csvFeedback.message}
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  बंद करें
                </button>
                <button
                  type="button"
                  onClick={handleProcessCsvImport}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow"
                >
                  आयात करें (Import Members)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
