/* eslint-disable no-unused-vars */

function checkStringLength(str, maxLength) {
  return str.length <= maxLength;
}

function isPalindrome(str) {
  const normalized = str.toLowerCase().replaceAll(' ', '');
  const reversed = normalized.split('').reverse().join('');
  return normalized === reversed;
}

function extractNumber(input) {
  const str = String(input);
  const digits = str.match(/\d/g);
  return digits ? Number(digits.join('')) : NaN;
}

/* eslint-enable no-unused-vars */
