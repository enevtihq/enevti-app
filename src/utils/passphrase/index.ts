import * as Lisk from '@liskhq/lisk-client';
import Aes from 'react-native-aes-crypto';

export function isValidPassphrase(passphrase: string) {
  return Lisk.passphrase.validation.getPassphraseValidationErrors(passphrase).length > 0
    ? false
    : true;
}

export function generatePassphrase() {
  return Lisk.passphrase.Mnemonic.generateMnemonic();
}

export default async function generateRandomKey() {
  return await Aes.randomKey(128);
}
