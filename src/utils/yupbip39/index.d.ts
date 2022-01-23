import * as Yup from 'yup';

declare module 'yup' {
  interface StringSchema {
    bip39(): StringSchema;
  }
}

declare function YupBIP39(yup: typeof Yup): void;

export default YupBIP39;
