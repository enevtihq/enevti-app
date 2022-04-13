import * as Lisk from '@liskhq/lisk-client';

export function isValidPassphrase(passphrase: string) {
  return Lisk.passphrase.validation.getPassphraseValidationErrors(passphrase)
    .length > 0
    ? false
    : true;
}

export function generatePassphrase() {
  return Lisk.passphrase.Mnemonic.generateMnemonic();
}
