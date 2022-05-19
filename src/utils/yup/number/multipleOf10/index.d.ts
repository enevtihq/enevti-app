import * as Yup from 'yup';

declare module 'yup' {
  interface NumberSchema {
    multipleOf10(): NumberSchema;
  }
}

declare function YupMultipleOf10(yup: typeof Yup): void;

export default YupMultipleOf10;
