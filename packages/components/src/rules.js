// Rule Definitions

export const required = (formValue, ruleValue, displayName, customErrorMessage) => {
  if (!ruleValue || formValue) return '';
  return customErrorMessage || `Enter a ${displayName}`;
};

/*
 * Credit Card number categories
 * -----------------------------
 * American Express :- prefix 34 or 37, length 15 digits.
 * Discover :- prefix 6011, length 16 digits or prefix 5, length 15 digits.
 * MasterCard :- prefix 51 through 55, length 16 digits.
 * Visa :- prefix 4, length 13 or 16 digits.
*/
export const getCreditCardType = (ccNumber) => {
  switch (ccNumber.substr(0, 2)) {
    case '34':
    case '37':
      return 'American Express';
    case '51':
    case '52':
    case '53':
    case '54':
    case '55':
      return 'Mastercard';
    default:
      break;
  }

  switch (ccNumber.substr(0, 4)) {
    case '6011':
      return 'Discover';
    default:
      break;
  }

  switch (ccNumber.substr(0, 1)) {
    case '4':
      return 'Visa';
    default:
      break;
  }

  return '';
};

export const isValidCCNumber = (() => {
  const luhnArr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
  return (ccNumber) => {
    let counter = 0;
    let incNum;
    let odd = false;
    const temp = String(ccNumber).replace(/[^\d]/g, '');
    if (temp.length === 0) return false;
    for (let i = temp.length - 1; i >= 0; i -= 1) {
      incNum = parseInt(temp.charAt(i), 10);
      odd = !odd;
      const oddCheck = odd;
      counter += oddCheck ? incNum : luhnArr[incNum];
    }
    return (counter % 10 === 0);
  };
})();

export const scrubCreditCardForm = (form) => ('CardNumber' in form
  ? {
    ...form,
    CardNumber: form.CardNumber.replace(/(-|\D)/g, '').substr(0, 16),
  } : form);


export const creditCardNumber = (formValue, ruleValue, displayName, customErrorMessage) => {
  if (!ruleValue || !formValue || isValidCCNumber(formValue)) return '';
  if (customErrorMessage) return customErrorMessage;

  switch (getCreditCardType(formValue)) {
    case 'American Express': return 'Use a valid American Express card number';
    case 'Discover': return 'Use a valid Discover card number';
    case 'Mastercard': return 'Use a valid Mastercard card number';
    case 'Visa': return 'Use a valid Visa card number';
    default: return `Use a valid ${displayName}`;
  }
};

export const year = (formValue, ruleValue, displayName, customErrorMessage) => {
  const value = formValue || '';
  if (value.length === 2 || value.length === 4) return '';
  return customErrorMessage || 'Must be a year.';
};

export const email = (formValue, ruleValue, displayName, customErrorMessage) => {
  const regex = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;
  if (!ruleValue || !formValue || regex.test(formValue)) return '';
  return customErrorMessage || `Use a valid ${displayName}`;
};

export const name = (formValue, ruleValue, displayName, customErrorMessage) => {
  const regex = /^[A-Z]+(\s+&\s+|(\s+|['-])[A-Z]+|(\s+&\s+|(\s+|)+))*$/i;
  if (!ruleValue || !formValue || regex.test(formValue)) return '';
  return customErrorMessage || 'Use letters only';
};


export const number = (formValue, ruleValue, displayName, customErrorMessage) => {
  const regex = /^\d+$/;
  if (!ruleValue || !formValue || regex.test(formValue)) return '';
  return customErrorMessage || 'Use only numbers';
};

export const maxLength = (formValue, ruleValue, displayName, customErrorMessage) => {
  const value = formValue || '';
  if (value.length <= ruleValue) return '';
  return customErrorMessage || `${displayName} must be at most ${ruleValue} characters`;
};

export const minLength = (formValue, ruleValue, displayName, customErrorMessage) => {
  if (formValue && formValue.length >= ruleValue) return '';
  return customErrorMessage || `${displayName} must be at least ${ruleValue} characters`;
};

export const minValue = (formValue, ruleValue, displayName, customErrorMessage) => {
  if (formValue >= ruleValue) return '';
  return customErrorMessage || `Enter at least ${ruleValue}`;
};

export const maxValue = (formValue, ruleValue, displayName, customErrorMessage) => {
  if (formValue <= ruleValue) return '';
  return customErrorMessage || `${displayName} must be less than or equal to ${ruleValue}`;
};

export const password = (formValue, ruleValue, displayName, customErrorMessage) => {
  const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*[\s"'`\\/]).{8,25}$/;
  if (!ruleValue || !formValue || regex.test(formValue)) return '';
  return customErrorMessage || 'Use at least one letter and number and no spaces, slashes, or quotation marks';
};

export const phone = (formValue, ruleValue, displayName, customErrorMessage) => {
  const regex = /^\s*([(]?)\[?\s*\d{3}\s*]?[)]?\s*[-]?[.]?\s*\d{3}\s*[-]?[.]?\s*\d{4}\s*$/i;
  if (!ruleValue || !formValue || regex.test(formValue)) return '';
  return customErrorMessage || 'Must be 10 digits; use numbers, dashes, or parentheses';
};

export const postalCode = (formValue, ruleValue, displayName, customErrorMessage) => {
  const regex = /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/;
  if (!ruleValue || !formValue || regex.test(formValue)) return '';
  return customErrorMessage || 'Use a valid U.S. or Canadian postal code';
};
