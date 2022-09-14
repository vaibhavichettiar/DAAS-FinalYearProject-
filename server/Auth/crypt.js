const CryptoJS = require('crypto-js');

const passphrase = 'Z:zR-u#RCZG2#5@$C1sOz_mkbBI8D5%R&eTZ<5}GJtU]V3~W6C_HxQy6939(KkF';

const encrypt = text => {
    return CryptoJS.AES.encrypt(text, passphrase).toString();
  };
  
  const decrypt = ciphertext => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };

  module.exports = {
    decrypt,
    encrypt
  }