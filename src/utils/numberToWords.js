// Utility to convert numbers to Hindi and English words for official receipts

const onesHindi = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
  'इक्यावन', 'बावन', 'तिरेपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
  'इकसठ', 'बासठ', 'तिरेसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सरसठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्नासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे',
  'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पंचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे'
];

const onesEnglish = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

const tensEnglish = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function numberToWordsHindi(num) {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return 'शून्य रुपये मात्र';
  if (num < 100) return `${onesHindi[num]} रुपये मात्र`;
  
  let words = '';
  if (Math.floor(num / 10000000) > 0) {
    words += `${onesHindi[Math.floor(num / 10000000)]} करोड़ `;
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += `${onesHindi[Math.floor(num / 100000)]} लाख `;
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += `${onesHindi[Math.floor(num / 1000)]} हज़ार `;
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    words += `${onesHindi[Math.floor(num / 100)]} सौ `;
    num %= 100;
  }
  if (num > 0) {
    words += `${onesHindi[num]} `;
  }
  return `${words.trim()} रुपये मात्र`;
}

export function numberToWordsEnglish(num) {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return 'Zero Rupees Only';

  function convertBelowThousand(n) {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += `${onesEnglish[Math.floor(n / 100)]} Hundred `;
      n %= 100;
    }
    if (n >= 20) {
      str += `${tensEnglish[Math.floor(n / 10)]} `;
      n %= 10;
    }
    if (n > 0) {
      str += `${onesEnglish[n]} `;
    }
    return str.trim();
  }

  let words = '';
  if (Math.floor(num / 10000000) > 0) {
    words += `${convertBelowThousand(Math.floor(num / 10000000))} Crore `;
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += `${convertBelowThousand(Math.floor(num / 100000))} Lakh `;
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += `${convertBelowThousand(Math.floor(num / 1000))} Thousand `;
    num %= 1000;
  }
  if (num > 0) {
    words += convertBelowThousand(num);
  }
  return `${words.trim()} Rupees Only`;
}
