'use strict';

const { default: i18n } = require('enevti-app/translations/i18n');

function multipleOf10() {
  return this.test({
    name: 'multipleOf10',
    exclusive: true,
    message: i18n.t('form:multipleOf10'),
    test(value) {
      return value % 10 === 0;
    },
  });
}

function setup(yup) {
  yup.addMethod(yup.number, 'multipleOf10', multipleOf10);
}

module.exports = setup;
