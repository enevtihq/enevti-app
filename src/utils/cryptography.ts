import crypto from 'crypto';
import { BRAND_NAME } from '../components/atoms/brand/AppBrandConstant';

const defaultSalt = BRAND_NAME;

export function pbkdf2Async(
  password: crypto.BinaryLike,
  salt?: crypto.BinaryLike,
) {
  return new Promise((res, rej) => {
    crypto.pbkdf2(
      password,
      salt ? salt : defaultSalt,
      10000,
      64,
      'sha512',
      (err, key) => {
        err ? rej(err) : res(key);
      },
    );
  });
}
