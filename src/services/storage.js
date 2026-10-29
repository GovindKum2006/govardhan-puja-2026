// Govardhan Puja Samiti 2026 - Data Persistence & Storage Service
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  MEMBERS: 'gps_members_2026',
  PROGRAMS: 'gps_programs_2026',
  ANNOUNCEMENTS: 'gps_announcements_2026',
  CONTACT_LOGS: 'gps_contact_logs_2026',
  SETTINGS: 'gps_settings_2026',
  CURRENT_USER_ROLE: 'gps_role_2026',
  CURRENT_USER_MEMBER_ID: 'gps_user_member_id_2026',
  PHOTOS: 'gps_photos_2026',
};

// Initial Demo Settings
export const DEFAULT_SETTINGS = {
  upiId: 'govardhan.ramandihra@oksbi',
  payeeName: 'श्री गोवर्धन पूजा समिति 2026 (रमन डिहरा)',
  defaultContribution: 7,
  organizerName: 'समिति मुख्य संयोजक',
  organizerPhone: '729485092',
  adminPasscode: 'govardhan2026',
  privacyMaskPhone: false,
  templeAddress: 'श्री कृष्ण मंदिर परिसर, ग्राम - रमन डिहरा',
  eventDate: '2026-11-10',
  supabaseUrl: '',
  supabaseAnonKey: '',
};

// Initial Demo Members (Clearly labeled as Demo Data)
export const INITIAL_DEMO_MEMBERS = [
  {
    id: 'mem_1',
    memberId: 'GPS-2026-001',
    name: 'रामेश्वर शर्मा (Demo)',
    mobile: '9876543211',
    address: 'वार्ड 4, मंदिर मार्ग',
    contributionRequired: 7,
    amountPaid: 7,
    balance: 0,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentVerified: true,
    paymentDate: '2026-10-25',
    transactionRef: 'UPI/261025/892341',
    notes: 'पूजन सामग्री व्यवस्थापक',
    lastContactDate: '2026-10-27',
    consentPublic: true,
  },
  {
    id: 'mem_2',
    memberId: 'GPS-2026-002',
    name: 'संजय यादव (Demo)',
    mobile: '9876543212',
    address: 'गोवर्धन नगर, गली 2',
    contributionRequired: 7,
    amountPaid: 7,
    balance: 0,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    paymentVerified: true,
    paymentDate: '2026-10-26',
    transactionRef: 'CASH-REC-002',
    notes: 'पंडाल सजावट समिति',
    lastContactDate: '2026-10-28',
    consentPublic: true,
  },
  {
    id: 'mem_3',
    memberId: 'GPS-2026-003',
    name: 'महेश वर्मा (Demo)',
    mobile: '9876543213',
    address: 'वार्ड 7, पटेल चौक',
    contributionRequired: 7,
    amountPaid: 0,
    balance: 7,
    paymentMethod: 'upi',
    paymentStatus: 'pending',
    paymentVerified: false,
    paymentDate: '',
    transactionRef: '',
    notes: 'कॉल पर 2 दिन में ऑनलाइन भुगतान का आश्वासन दिया',
    lastContactDate: '2026-10-29',
    consentPublic: true,
  },
  {
    id: 'mem_4',
    memberId: 'GPS-2026-004',
    name: 'दीपक जोशी (Demo)',
    mobile: '9876543214',
    address: 'शास्त्री नगर',
    contributionRequired: 21,
    amountPaid: 21,
    balance: 0,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentVerified: true,
    paymentDate: '2026-10-26',
    transactionRef: 'UPI/261026/778899',
    notes: 'विशेष भोग अर्पण सहयोग',
    lastContactDate: '2026-10-26',
    consentPublic: true,
  },
  {
    id: 'mem_5',
    memberId: 'GPS-2026-005',
    name: 'विकास यादव (Demo)',
    mobile: '9876543215',
    address: 'यादव मोहल्ला',
    contributionRequired: 7,
    amountPaid: 5,
    balance: 2,
    paymentMethod: 'cash',
    paymentStatus: 'partially_paid',
    paymentVerified: true,
    paymentDate: '2026-10-27',
    transactionRef: 'CASH-REC-005',
    notes: 'शेष ₹2 पूजा के दिन देंगे',
    lastContactDate: '2026-10-27',
    consentPublic: true,
  },
  {
    id: 'mem_6',
    memberId: 'GPS-2026-006',
    name: 'अनिल कुमार सिंह (Demo)',
    mobile: '9876543216',
    address: 'स्टेशन रोड',
    contributionRequired: 7,
    amountPaid: 0,
    balance: 7,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    paymentVerified: false,
    paymentDate: '',
    transactionRef: '',
    notes: 'अभी संपर्क नहीं हुआ',
    lastContactDate: '',
    consentPublic: true,
  },
  {
    id: 'mem_7',
    memberId: 'GPS-2026-007',
    name: 'प्रदीप गुप्ता (Demo)',
    mobile: '9876543217',
    address: 'बाज़ार चौक',
    contributionRequired: 7,
    amountPaid: 7,
    balance: 0,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentVerified: false, // Pending Admin Verification
    paymentDate: '2026-10-29',
    transactionRef: 'UPI/261029/554433',
    notes: 'UPI से भुगतान किया - रसीद सत्यापन प्रतीक्षारत',
    lastContactDate: '2026-10-29',
    consentPublic: true,
  }
];

// Initial Demo Programs (Activities)
export const INITIAL_DEMO_PROGRAMS = [
  {
    id: 'prog_1',
    name: 'Puja preparation',
    nameHi: 'पूजा की प्रारंभिक तैयारी एवं वेदी निर्माण',
    date: '2026-11-10',
    startTime: '07:00',
    endTime: '09:00',
    location: 'मुख्य मंदिर प्रांगण',
    description: 'गोवर्धन जी के विग्रह का निर्माण, गोबर व पुष्प सज्जा, दीप स्थापना एवं वेदी पूजन।',
    responsibleMember: 'रामेश्वर शर्मा एवं सेवादार दल',
    status: 'planned'
  },
  {
    id: 'prog_2',
    name: 'Decoration and cleaning',
    nameHi: 'मंदिर परिसर सजावट एवं स्वच्छता अभियान',
    date: '2026-11-10',
    startTime: '09:00',
    endTime: '11:00',
    location: 'संपूर्ण मंदिर परिसर एवं प्रवेश द्वार',
    description: 'फूलों की माला, रंगोली, तोरण द्वार, एवं स्वच्छता का समुचित प्रबंध।',
    responsibleMember: 'समिति सेवादार एवं युवा मंडल',
    status: 'planned'
  },
  {
    id: 'prog_3',
    name: 'Govardhan Puja & Annakut',
    nameHi: 'श्री गोवर्धन महापूजा एवं अन्नकूट भोग दर्शन',
    date: '2026-11-10',
    startTime: '11:30',
    endTime: '13:30',
    location: 'गोवर्धन शिला वेदी',
    description: 'वैदिक मंत्रोच्चार के साथ मुख्य गोवर्धन पूजा, 56 भोग अर्पण एवं सामूहिक महाआरती।',
    responsibleMember: 'पं. राजेश शास्त्री एवं मुख्य समिति',
    status: 'planned'
  },
  {
    id: 'prog_4',
    name: 'Prasad preparation',
    nameHi: 'छप्पन भोग एवं महाप्रसाद निर्माण',
    date: '2026-11-10',
    startTime: '08:00',
    endTime: '12:00',
    location: 'सामुदायिक रसोई (यज्ञशाला)',
    description: 'शुद्ध घी के मिष्ठान, अन्नकूट कढ़ी, बाजरा व पूड़ी का पवित्र निर्माण।',
    responsibleMember: 'दीपक जोशी एवं भोजन समिति',
    status: 'planned'
  },
  {
    id: 'prog_5',
    name: 'Prasad distribution',
    nameHi: 'सामूहिक महाप्रसाद वितरण (अन्नकूट भंडारा)',
    date: '2026-11-10',
    startTime: '13:30',
    endTime: '17:00',
    location: 'अन्नपूर्णा पंडाल',
    description: 'सभी भक्तजनों एवं ग्रामीणों को पंक्तिबद्ध महाप्रसाद वितरण।',
    responsibleMember: 'विकास यादव एवं स्वयंसेवक दल',
    status: 'planned'
  },
  {
    id: 'prog_6',
    name: 'Bhajan and kirtan',
    nameHi: 'हरिनाम संकीर्तन एवं भजन संध्या',
    date: '2026-11-10',
    startTime: '17:30',
    endTime: '20:30',
    location: 'सत्संग भवन',
    description: 'वृंदावन धाम के रसिक भजनों एवं कृष्ण लीला संकीर्तन का दिव्य आयोजन।',
    responsibleMember: 'प्रदीप गुप्ता एवं महिला संकीर्तन मंडल',
    status: 'planned'
  },
  {
    id: 'prog_7',
    name: 'Community gathering',
    nameHi: 'सामुदायिक मिलन, सम्मान समारोह एवं आशीर्वचन',
    date: '2026-11-10',
    startTime: '20:30',
    endTime: '21:30',
    location: 'मुख्य मंच',
    description: 'समिति के वरिष्ठ सदस्यों एवं विशिष्ट सहयोगियों का सम्मान व आगामी वर्ष की रूपरेखा।',
    responsibleMember: 'समिति मुख्य संयोजक',
    status: 'planned'
  },
  {
    id: 'prog_8',
    name: 'Cleaning after the program',
    nameHi: 'उत्सव पश्चात स्वच्छता एवं पर्यावरण संरक्षण सेवा',
    date: '2026-11-10',
    startTime: '21:30',
    endTime: '23:00',
    location: 'मंदिर एवं भोजन परिसर',
    description: 'पत्तलों व कचरे का सुरक्षित निस्तारण एवं संपूर्ण परिसर की पूर्ण सफाई।',
    responsibleMember: 'समस्त युवा स्वयंसेवक',
    status: 'planned'
  }
];

// Initial Demo Announcements
export const INITIAL_DEMO_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'गोवर्धन पूजा महामहोत्सव 2026 - तैयारी बैठक सूचना',
    body: 'जय श्री कृष्ण 🙏 सभी सदस्यों को सूचित किया जाता है कि गोवर्धन पूजा की तैयारी के लिए महत्वपूर्ण बैठक 10 नवंबर से पूर्व मंदिर प्रांगण में रखी गई है। सभी पदाधिकारी एवं सदस्य समय पर उपस्थित होकर उत्सव की तैयारियों में सहयोग दें।',
    date: '2026-10-28',
    category: 'meeting',
    priority: 'high',
    senderName: 'समिति मुख्य संयोजक (रमन डिहरा)',
    targetGroup: 'all'
  },
  {
    id: 'ann_2',
    title: 'सहयोग राशि (न्यूनतम ₹7) जमा कराने का विनम्र आग्रह',
    body: 'समस्त सम्मानित सदस्यों से अनुरोध है कि गोवर्धन पूजा एवं अन्नकूट भंडारा के आयोजन हेतु अपनी स्वीकृत सहयोग राशि (न्यूनतम ₹7 या इच्छानुसार) ऑनलाइन UPI अथवा नकद समिति कोषाध्यक्ष के पास 8 नवंबर तक अवश्य जमा कराएं।',
    date: '2026-10-27',
    category: 'payment',
    priority: 'high',
    senderName: 'कोषाध्यक्ष - गोवर्धन पूजा समिति',
    targetGroup: 'pending'
  },
  {
    id: 'ann_3',
    title: 'सेवादार दायित्व एवं अन्नकूट प्रसाद व्यवस्था',
    body: 'प्रसाद निर्माण, वितरण एवं पंडाल सज्जा हेतु युवा सेवादारों की सूची जारी कर दी गई है। सभी कार्यकर्ता अपने निर्धारित समय पर पहुंचकर अपनी सेवा का लाभ लें।',
    date: '2026-10-26',
    category: 'volunteer',
    priority: 'normal',
    senderName: 'रामेश्वर शर्मा (व्यवस्थापक)',
    targetGroup: 'all'
  }
];

// Initial Demo Contact Logs
export const INITIAL_DEMO_CONTACT_LOGS = [
  {
    id: 'log_1',
    memberId: 'GPS-2026-003',
    memberName: 'महेश वर्मा (Demo)',
    memberMobile: '9876543213',
    contactDate: '2026-10-29 11:30 AM',
    notes: 'सदस्य ने फोन पर बताया कि वे कल शाम तक UPI द्वारा ₹7 सहयोग राशि भेज देंगे।',
    contactMethod: 'call',
    organizerName: 'सुरेश पटेल'
  },
  {
    id: 'log_2',
    memberId: 'GPS-2026-005',
    memberName: 'विकास यादव (Demo)',
    memberMobile: '9876543215',
    contactDate: '2026-10-27 04:15 PM',
    notes: 'भोजन निर्माण सेवा में 10 नवंबर को सुबह 7 बजे उपस्थित रहने की पुष्टि की।',
    contactMethod: 'whatsapp',
    organizerName: 'सुरेश पटेल'
  }
];

// Initial Demo Photos (All Festival Photos)
export const INITIAL_PHOTOS = [
  {
    id: 'photo_1',
    title: 'श्री गिरिराज गोवर्धन धारण एवं सुरभि गौ सेवा दर्शन',
    titleEn: 'Lord Krishna Lifting Govardhan Hill & Gau Seva',
    category: 'भगवान श्री कृष्ण दर्शन',
    url: '/assets/krishna-govardhan.png',
    caption: 'भगवान श्री कृष्ण द्वारा ब्रजवासियों एवं गौवंश की रक्षार्थ गोवर्धन पर्वत उठाना तथा सुरभि गौमाता का वंदन।',
    date: '2026-10-29'
  },
  {
    id: 'photo_2',
    title: 'स्वर्ण गोवर्धन पूजा एवं 56 भोग अन्नकूट महामहोत्सव',
    titleEn: 'Golden Govardhana Puja Celebration & 56 Bhog',
    category: 'अन्नकूट महोत्सव',
    url: '/assets/golden-govardhan-puja.png',
    caption: 'जगमगाते दीपों, भव्य तोरण द्वार एवं 56 भोग अन्नकूट महाप्रसाद के साथ श्री गोवर्धन पूजा दर्शन।',
    date: '2026-10-29'
  },
  {
    id: 'photo_3',
    title: 'पारिवारिक पूजा एवं बाल गोपाल आशीर्वाद दर्शन',
    titleEn: 'Family Devotion & Bal Gopal Blessings',
    category: 'भक्त एवं परिवार',
    url: '/assets/festive-puja-family.png',
    caption: 'पारंपरिक परिधानों में ग्राम रमन डिहरा के श्रद्धालु परिवार द्वारा बाल गोपाल एवं गोवर्धन जी की आराधना।',
    date: '2026-10-29'
  },
  {
    id: 'photo_4',
    title: 'समिति सेवादार एवं युवा कार्यकर्ता दर्शन',
    titleEn: 'Samiti Youth Volunteers & Devotees',
    category: 'सेवादार दल',
    url: '/assets/young-man-temple.png',
    caption: 'रमन डिहरा मंदिर परिसर में गोवर्धन पूजा एवं अन्नकूट व्यवस्था में समर्पित युवा स्वयंसेवक।',
    date: '2026-10-29'
  }
];

// Helper to get Supabase Client dynamically
export function getSupabaseClient(url, key) {
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (err) {
    console.error('Supabase init failed:', err);
    return null;
  }
}

// Storage Manager
export const StorageService = {
  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(data);
      let needsSave = false;
      if (!parsed.payeeName || !parsed.payeeName.includes('रमन डिहरा')) {
        parsed.payeeName = DEFAULT_SETTINGS.payeeName;
        parsed.templeAddress = DEFAULT_SETTINGS.templeAddress;
        parsed.upiId = parsed.upiId || DEFAULT_SETTINGS.upiId;
        needsSave = true;
      }
      if (!parsed.organizerPhone || parsed.organizerPhone === '9876543210' || (parsed.organizerName && parsed.organizerName.includes('सुरेश'))) {
        parsed.organizerName = DEFAULT_SETTINGS.organizerName;
        parsed.organizerPhone = DEFAULT_SETTINGS.organizerPhone;
        needsSave = true;
      }
      if (needsSave) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Members
  getMembers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_DEMO_MEMBERS));
        return INITIAL_DEMO_MEMBERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_MEMBERS;
    }
  },

  saveMembers(members) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  },

  addMember(memberData) {
    const members = this.getMembers();
    // Generate next unique Member ID: GPS-2026-XXX
    const nextSeq = members.length + 1;
    const memberId = `GPS-2026-${String(nextSeq).padStart(3, '0')}`;
    
    const required = Number(memberData.contributionRequired || 7);
    const paid = Number(memberData.amountPaid || 0);
    const balance = Math.max(0, required - paid);
    
    let status = memberData.paymentStatus || 'pending';
    if (paid >= required && required > 0) {
      status = 'paid';
    } else if (paid > 0 && paid < required) {
      status = 'partially_paid';
    } else {
      status = 'pending';
    }

    const newMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      memberId,
      name: memberData.name.trim(),
      mobile: memberData.mobile.trim(),
      address: memberData.address ? memberData.address.trim() : '',
      contributionRequired: required,
      amountPaid: paid,
      balance,
      paymentMethod: memberData.paymentMethod || 'upi',
      paymentStatus: status,
      paymentVerified: memberData.paymentVerified || (status === 'paid' && memberData.paymentMethod === 'cash'),
      paymentDate: memberData.paymentDate || (paid > 0 ? new Date().toISOString().split('T')[0] : ''),
      transactionRef: memberData.transactionRef || '',
      notes: memberData.notes || '',
      lastContactDate: '',
      consentPublic: memberData.consentPublic !== false,
      createdAt: new Date().toISOString()
    };

    members.unshift(newMember);
    this.saveMembers(members);
    return newMember;
  },

  updateMember(id, updatedFields) {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === id);
    if (index === -1) return null;

    const existing = members[index];
    const required = updatedFields.contributionRequired !== undefined ? Number(updatedFields.contributionRequired) : existing.contributionRequired;
    const paid = updatedFields.amountPaid !== undefined ? Number(updatedFields.amountPaid) : existing.amountPaid;
    const balance = Math.max(0, required - paid);

    let status = updatedFields.paymentStatus || existing.paymentStatus;
    if (paid >= required && required > 0) {
      status = 'paid';
    } else if (paid > 0 && paid < required) {
      status = 'partially_paid';
    } else if (paid === 0) {
      status = 'pending';
    }

    members[index] = {
      ...existing,
      ...updatedFields,
      contributionRequired: required,
      amountPaid: paid,
      balance,
      paymentStatus: status,
      updatedAt: new Date().toISOString()
    };

    this.saveMembers(members);
    return members[index];
  },

  deleteMember(id) {
    const members = this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    this.saveMembers(filtered);
    return true;
  },

  verifyPayment(id, isVerified = true) {
    return this.updateMember(id, { paymentVerified: isVerified });
  },

  checkDuplicate(mobile, name, excludeId = null) {
    const members = this.getMembers();
    const cleanMobile = mobile ? mobile.replace(/\D/g, '') : '';
    const cleanName = name ? name.trim().toLowerCase() : '';

    return members.some(m => {
      if (excludeId && m.id === excludeId) return false;
      const mCleanMobile = m.mobile ? m.mobile.replace(/\D/g, '') : '';
      const mCleanName = m.name ? m.name.trim().toLowerCase() : '';
      if (cleanMobile && mCleanMobile && cleanMobile.slice(-10) === mCleanMobile.slice(-10)) return true;
      if (cleanName && mCleanName && cleanName === mCleanName) return true;
      return false;
    });
  },

  // Programs / Activities
  getPrograms() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_DEMO_PROGRAMS));
        return INITIAL_DEMO_PROGRAMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_PROGRAMS;
    }
  },

  savePrograms(programs) {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  },

  addProgram(programData) {
    const programs = this.getPrograms();
    const newProg = {
      id: `prog_${Date.now()}`,
      name: programData.name.trim(),
      nameHi: programData.nameHi ? programData.nameHi.trim() : programData.name.trim(),
      date: programData.date || '2026-11-10',
      startTime: programData.startTime || '10:00',
      endTime: programData.endTime || '12:00',
      location: programData.location || 'पंडाल',
      description: programData.description || '',
      responsibleMember: programData.responsibleMember || '',
      status: programData.status || 'planned',
      createdAt: new Date().toISOString()
    };
    programs.push(newProg);
    this.savePrograms(programs);
    return newProg;
  },

  updateProgram(id, updatedFields) {
    const programs = this.getPrograms();
    const index = programs.findIndex(p => p.id === id);
    if (index === -1) return null;
    programs[index] = { ...programs[index], ...updatedFields };
    this.savePrograms(programs);
    return programs[index];
  },

  deleteProgram(id) {
    const programs = this.getPrograms();
    const filtered = programs.filter(p => p.id !== id);
    this.savePrograms(filtered);
    return true;
  },

  // Announcements
  getAnnouncements() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_DEMO_ANNOUNCEMENTS));
        return INITIAL_DEMO_ANNOUNCEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ANNOUNCEMENTS;
    }
  },

  saveAnnouncements(announcements) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  addAnnouncement(annData) {
    const announcements = this.getAnnouncements();
    const newAnn = {
      id: `ann_${Date.now()}`,
      title: annData.title.trim(),
      body: annData.body.trim(),
      date: annData.date || new Date().toISOString().split('T')[0],
      category: annData.category || 'general',
      priority: annData.priority || 'normal',
      senderName: annData.senderName || 'समिति संयोजक',
      targetGroup: annData.targetGroup || 'all',
      createdAt: new Date().toISOString()
    };
    announcements.unshift(newAnn);
    this.saveAnnouncements(announcements);
    return newAnn;
  },

  deleteAnnouncement(id) {
    const announcements = this.getAnnouncements();
    const filtered = announcements.filter(a => a.id !== id);
    this.saveAnnouncements(filtered);
    return true;
  },

  // Contact Logs
  getContactLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACT_LOGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(INITIAL_DEMO_CONTACT_LOGS));
        return INITIAL_DEMO_CONTACT_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_CONTACT_LOGS;
    }
  },

  saveContactLogs(logs) {
    localStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(logs));
  },

  logContact(memberId, memberName, memberMobile, notes, method = 'call') {
    const logs = this.getContactLogs();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newLog = {
      id: `log_${Date.now()}`,
      memberId,
      memberName,
      memberMobile,
      contactDate: formattedDate,
      notes: notes || 'बातचीत हुई',
      contactMethod: method,
      organizerName: this.getSettings().organizerName
    };
    logs.unshift(newLog);
    this.saveContactLogs(logs);

    // Update lastContactDate on the member
    this.updateMember(memberId, { lastContactDate: now.toISOString().split('T')[0] });
    return newLog;
  },

  // Role Management
  getCurrentRole() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) || 'admin';
  },

  setCurrentRole(role) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, role);
  },

  getCurrentMemberId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_MEMBER_ID) || '';
  },

  setCurrentMemberId(id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_MEMBER_ID, id);
  },

  // Full Database Backup & Restore
  exportDatabaseJSON() {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      samiti: 'श्री गोवर्धन पूजा समिति 2026',
      settings: this.getSettings(),
      members: this.getMembers(),
      programs: this.getPrograms(),
      announcements: this.getAnnouncements(),
      contactLogs: this.getContactLogs(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importDatabaseJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (data.members) this.saveMembers(data.members);
      if (data.programs) this.savePrograms(data.programs);
      if (data.announcements) this.saveAnnouncements(data.announcements);
      if (data.contactLogs) this.saveContactLogs(data.contactLogs);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  resetToDemo() {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_DEMO_MEMBERS));
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_DEMO_PROGRAMS));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_DEMO_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(INITIAL_DEMO_CONTACT_LOGS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  },

  // Photos Gallery Box
  getPhotos() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
        return INITIAL_PHOTOS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PHOTOS;
    }
  },

  savePhotos(photos) {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  },

  addPhoto(photoData) {
    const photos = this.getPhotos();
    const newPhoto = {
      id: `photo_${Date.now()}`,
      title: photoData.title.trim(),
      titleEn: photoData.titleEn || photoData.title.trim(),
      category: photoData.category || 'उत्सव दर्शन',
      url: photoData.url,
      caption: photoData.caption || '',
      date: new Date().toISOString().split('T')[0]
    };
    photos.push(newPhoto);
    this.savePhotos(photos);
    return newPhoto;
  },

  deletePhoto(id) {
    const photos = this.getPhotos();
    const filtered = photos.filter(p => p.id !== id);
    this.savePhotos(filtered);
    return true;
  },

  clearAll() {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify([]));
  }
};
