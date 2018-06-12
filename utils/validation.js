/*
  This file contains functions to validate input, namely:
  - isRealString(str): determines if str is a variable of type string and that it contains at least one non-space character
*/

var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};
