import i18n from 'enevti-app/translations/i18n';

export function dayToString(day: number) {
  switch (day) {
    case 0:
      return i18n.t('date:sunday');
    case 1:
      return i18n.t('date:monday');
    case 2:
      return i18n.t('date:tuesday');
    case 3:
      return i18n.t('date:wednesday');
    case 4:
      return i18n.t('date:thursday');
    case 5:
      return i18n.t('date:friday');
    case 6:
      return i18n.t('date:saturday');
    default:
  }
}

export function monthToString(month: number) {
  switch (month) {
    case 0:
      return i18n.t('date:january');
    case 1:
      return i18n.t('date:february');
    case 2:
      return i18n.t('date:march');
    case 3:
      return i18n.t('date:april');
    case 4:
      return i18n.t('date:may');
    case 5:
      return i18n.t('date:june');
    case 6:
      return i18n.t('date:july');
    case 7:
      return i18n.t('date:august');
    case 8:
      return i18n.t('date:september');
    case 9:
      return i18n.t('date:october');
    case 10:
      return i18n.t('date:november');
    case 11:
      return i18n.t('date:december');
    default:
  }
}
