export const stripPhone = (phoneNumber) => phoneNumber.replace(/[^0-9]+/g, '');

const formatUSPhone = (phoneNumber) => {
  const strippedPhoneNumber = stripPhone(phoneNumber);

  // The substring function return an empty string when the index is out of bounds
  const areaCode = strippedPhoneNumber.substring(0, 3);
  const prefix = strippedPhoneNumber.substring(3, 6);
  const lineNumber = strippedPhoneNumber.substring(6, 10);
  const other = strippedPhoneNumber.substring(10);

  return `(${areaCode}) ${prefix}-${lineNumber}${other}`;
};

export const formatPhone = (phoneNumber, phoneError) => {
  // This allows US numbers to look pretty without messing up the international formatting
  const isInternationalFormat = (phoneNumber.charAt(0) === '+');
  const strippedPhone = stripPhone(phoneNumber);

  // Don't apply formatting to international numbers
  // Don't start applying formatting until the user has typed enough characters
  // Don't apply formatting when there's an error

  const formattedPhone = !isInternationalFormat && (strippedPhone.length > 3) && !phoneError
    ? formatUSPhone(phoneNumber) : phoneNumber;

  return formattedPhone;
};


export const isValidUsPhone = (phoneNumber) => {
  // Copied from R2D2
  const phoneRegex = /^\s*([(]?)\[?\s*\d{3}\s*]?[)]?\s*[-]?[.]?\s*\d{3}\s*[-]?[.]?\s*\d{4}\s*$/i;
  return phoneRegex.test(phoneNumber);
};

export const isValidInternationalPhone = (phoneNumber) => {
  // This will validate the general pattern but not the country codes
  const phoneRegex = /^\+?\(?(?:[0-9][()\s-]*){6,14}[0-9]$/;
  return phoneRegex.test(phoneNumber);
};


export const validatePhone = (phoneNumber) => isValidUsPhone(phoneNumber)
|| isValidInternationalPhone(phoneNumber);
