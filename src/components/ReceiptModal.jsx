import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { numberToWordsHindi, numberToWordsEnglish } from '../utils/numberToWords';

export default function ReceiptModal({ isOpen, onClose, member, settings, t }) {
  if (!isOpen || !member) return null;

  const receiptNo = `GPS-REC-${member.memberId ? member.memberId.replace('GPS-', '') : '2026'}`;
  const receiptDate = member.paymentDate || new Date().toISOString().split('T')[0];
  const amount = Number(member.amountPaid || member.contributionRequired || 7);
  const hindiWords = numberToWordsHindi(amount);
  const englishWords = numberToWordsEnglish(amount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border-2 border-amber-500 overflow-hidden">
        
        {/* Modal Bar */}
        <div className="no-print bg-gradient-to-r from-amber-700 to-orange-700 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm">अधिकृत दान एवं सहयोग रसीद (Official Receipt)</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट करें (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-[#fffefb] relative border-4 border-amber-300/80 m-2 rounded-xl text-gray-800">
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <span className="text-9xl font-heading font-extrabold text-amber-950">गोवर्धन</span>
          </div>

          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-amber-500">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <span className="text-amber-600 text-xl">🚩</span>
              <span className="text-xs font-bold text-amber-800 tracking-wider">॥ ॐ नमो भगवते वासुदेवाय ॥</span>
              <span className="text-amber-600 text-xl">🚩</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-950 leading-tight">
              {settings.payeeName || 'श्री गोवर्धन पूजा समिति 2026'}
            </h2>
            <p className="text-xs text-amber-800 font-medium mt-0.5">
              {settings.templeAddress || 'श्री कृष्ण मंदिर परिसर, गोवर्धन चौक'}
            </p>
            <div className="mt-2 inline-block bg-amber-100 text-amber-900 border border-amber-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              दान एवं सहयोग पावती रसीद (Contribution Receipt)
            </div>
          </div>

          {/* Receipt Meta (No. & Date) */}
          <div className="flex justify-between items-center text-xs font-semibold py-3 border-b border-amber-200">
            <div>
              <span className="text-gray-500">रसीद संख्या (Receipt No): </span>
              <span className="font-mono font-bold text-amber-900">{receiptNo}</span>
            </div>
            <div>
              <span className="text-gray-500">दिनांक (Date): </span>
              <span className="font-bold text-gray-800">{receiptDate}</span>
            </div>
          </div>

          {/* Member Details */}
          <div className="py-4 space-y-3 text-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-gray-300 pb-1.5">
              <span className="text-xs font-bold text-gray-600 sm:w-44 shrink-0">
                सहयोगदाता का नाम (Received with thanks from):
              </span>
              <span className="font-bold text-gray-900 text-base">{member.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dotted border-gray-300 pb-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-xs font-bold text-gray-600">सदस्य क्रमांक (Member ID):</span>
                <span className="font-mono font-bold text-amber-800">{member.memberId || 'GPS-2026'}</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xs font-bold text-gray-600">मोबाइल (Mobile):</span>
                <span className="font-mono text-gray-800">{member.mobile}</span>
              </div>
            </div>

            {member.address && (
              <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-gray-300 pb-1.5">
                <span className="text-xs font-bold text-gray-600 sm:w-44 shrink-0">
                  पता / स्थान (Locality/Address):
                </span>
                <span className="text-gray-800">{member.address}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-dotted border-gray-300 pb-1.5">
              <span className="text-xs font-bold text-gray-600 sm:w-44 shrink-0">
                राशि शब्दों में (Sum of Rupees in Words):
              </span>
              <div className="flex-1">
                <div className="font-bold text-amber-950 font-hindi">{hindiWords}</div>
                <div className="text-[11px] text-gray-600 italic">({englishWords})</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dotted border-gray-300 pb-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-xs font-bold text-gray-600">भुगतान माध्यम (Mode):</span>
                <span className="font-semibold text-gray-800 uppercase">
                  {member.paymentMethod === 'upi' ? 'UPI (ऑनलाइन)' : 'नकद (Cash)'}
                </span>
              </div>
              {member.transactionRef && (
                <div className="flex items-baseline space-x-1">
                  <span className="text-xs font-bold text-gray-600">Ref / UTR:</span>
                  <span className="font-mono text-xs text-gray-700 truncate">{member.transactionRef}</span>
                </div>
              )}
            </div>

          </div>

          {/* Amount Box & Official Stamp */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Amount Badge */}
            <div className="bg-amber-100/80 border-2 border-amber-500 rounded-xl px-5 py-3 text-center sm:text-left">
              <span className="text-[10px] font-bold text-amber-800 block uppercase">प्राप्त सहयोग राशि (Amount Paid)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-heading">
                ₹{amount}/-
              </span>
            </div>

            {/* Verification Stamp */}
            <div className="flex items-center space-x-3 text-center sm:text-right">
              {/* Seal */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600 p-1 flex flex-col items-center justify-center text-emerald-800 text-[10px] font-bold leading-tight rotate-6 select-none bg-emerald-50/50">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-0.5" />
                <span>सत्यापित</span>
                <span>समिति 2026</span>
              </div>

              {/* Signatory */}
              <div>
                <div className="text-xs font-bold text-gray-800">{settings.organizerName}</div>
                <div className="text-[11px] text-gray-500">अधिकृत कोषाध्यक्ष / संयोजक</div>
                <div className="text-[10px] text-amber-700 italic">श्री गोवर्धन पूजा समिति (रमन डिहरा)</div>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-3 border-t border-gray-300 text-center text-[10px] text-gray-500">
            * यह रसीद कंप्यूटर जनित एवं श्री गोवर्धन पूजा समिति 2026 (रमन डिहरा) द्वारा डिजिटल रूप से प्रमाणित है। भगवान श्री कृष्ण आपकी सपरिवार रक्षा करें।
          </div>

        </div>

        {/* Modal Actions */}
        <div className="no-print bg-gray-50 p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold"
          >
            बंद करें (Close)
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>रसीद प्रिंट / PDF सेव करें</span>
          </button>
        </div>

      </div>
    </div>
  );
}
