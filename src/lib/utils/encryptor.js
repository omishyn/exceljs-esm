'use strict';

/* eslint-disable no-empty,no-unused-vars */

let _crypto;

if(typeof require !== 'undefined') {
  try { _crypto = require('crypto'); } catch(e) {}
}

/* eslint-disable node/no-extraneous-require,object-shorthand */
let _Buffer;
if (typeof Buffer !== 'undefined' && Buffer.alloc) {
  _Buffer = Buffer;
} else {
  try { const {Buffer} = require('buffer');  _Buffer = Buffer; } catch(e) {}
}

// const crypto = require('crypto');

const Encryptor = {
  /**
   * Calculate a hash of the concatenated buffers with the given algorithm.
   * @param {string} algorithm - The hash algorithm.
   * @returns {Buffer} The hash
   */
  hash(algorithm, ...buffers) {
    const hash = _crypto.createHash(algorithm);
    hash.update(_Buffer.concat(buffers));
    return hash.digest();
  },
  /**
   * Convert a password into an encryption key
   * @param {string} password - The password
   * @param {string} hashAlgorithm - The hash algoritm
   * @param {string} saltValue - The salt value
   * @param {number} spinCount - The spin count
   * @param {number} keyBits - The length of the key in bits
   * @param {Buffer} blockKey - The block key
   * @returns {Buffer} The encryption key
   */
  convertPasswordToHash(password, hashAlgorithm, saltValue, spinCount) {
    hashAlgorithm = hashAlgorithm.toLowerCase();
    const hashes = _crypto.getHashes();
    if (hashes.indexOf(hashAlgorithm) < 0) {
      throw new Error(`Hash algorithm '${hashAlgorithm}' not supported!`);
    }

    // Password must be in unicode buffer
    const passwordBuffer = _Buffer.from(password, 'utf16le');
    // Generate the initial hash
    let key = this.hash(hashAlgorithm, _Buffer.from(saltValue, 'base64'), passwordBuffer);
    // Now regenerate until spin count
    for (let i = 0; i < spinCount; i++) {
      const iterator = _Buffer.alloc(4);
      // this is the 'special' element of Excel password hashing
      // that stops us from using crypto.pbkdf2()
      iterator.writeUInt32LE(i, 0);
      key = this.hash(hashAlgorithm, key, iterator);
    }
    return key.toString('base64');
  },
  /**
   * Generates cryptographically strong pseudo-random data.
   * @param size The size argument is a number indicating the number of bytes to generate.
   */
  randomBytes(size) {
    return _crypto.randomBytes(size);
  },
};
module.exports = Encryptor;
