export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  error?: string;
}

export function validatePakistaniPhone(phone: string): PhoneValidationResult {
  // 1. Strip all non-digit characters except a leading +
  let clean = phone.replace(/[^\d+]/g, '');

  // If there's a + anywhere except the very beginning, strip all +'s
  if (clean.indexOf('+') > 0) {
    clean = clean.replace(/\+/g, '');
  }

  // 2. Remove any valid prefix to isolate the 10-digit core number
  let core = clean;
  if (core.startsWith('+92')) {
    core = core.slice(3);
  } else if (core.startsWith('0092')) {
    core = core.slice(4);
  } else if (core.startsWith('92')) {
    core = core.slice(2);
  }

  // Strip leading 0 if present (e.g. they typed +920300 or just 0300)
  if (core.startsWith('0')) {
    core = core.slice(1);
  }

  // 3. Confirm what remains is exactly 10 digits starting with '3'
  if (/^3\d{9}$/.test(core)) {
    return { 
      isValid: true, 
      normalized: '+92' + core 
    };
  } else {
    return { 
      isValid: false, 
      error: 'Please enter a valid Pakistani mobile number, e.g. 03001234567 or +923001234567' 
    };
  }
}
