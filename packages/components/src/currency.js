/**
 * formatCents: Takes a cent amount and returns a string with
 * 1) appropriate number of decimal places, 2) Leading cent sign
 * @param {number} amount : Any cent amount
 */
export const formatCents = (amount = 0) => {
  const cents = amount * 100;
  const centsFixed = cents.toFixed(1);
  const formattedCents = `${centsFixed}¢`;

  return formattedCents;
};

/**
 * formatDollars: Takes a dollar amount and returns a string with
 * 1) appropriate number of decimal places, 2) comma separators and
 * 3) Leading dollar sign
 * @param {number} amount : Any dollar amount
 */
export const formatDollars = (amount = 0) => {
  // Clean up any rounding errors
  const fixedAmount = Number(amount.toFixed(2));

  // Does it have any cents?
  const decimalPlaces = fixedAmount % 1 ? 2 : 0;

  // Only show the extra zeroes when there's cents to show
  const formattedDollars = Number(fixedAmount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimalPlaces,
  });

  return formattedDollars;
};

export const formatCost = (cost = 0) => (cost < 1 ? formatCents(cost) : formatDollars(cost));
