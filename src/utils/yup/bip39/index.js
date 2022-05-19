'use strict';
import * as Lisk from '@liskhq/lisk-client';

function bip39() {
  return this.test({
    name: 'bip39',
    exclusive: true,
    test(value) {
      if (value) {
        return new Promise((resolve, reject) => {
          const errors = Lisk.passphrase.validation.getPassphraseValidationErrors(value);
          if (errors.length !== 0) {
            reject(this.createError({ path: this.path, message: errors.toString() }));
          }
          resolve(true);
        });
      }
      return false;
    },
  });
}

function setup(yup) {
  yup.addMethod(yup.string, 'bip39', bip39);
}

module.exports = setup;
