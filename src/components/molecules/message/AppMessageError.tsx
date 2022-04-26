import React from 'react';
import AppInfoMessage from './base/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

export default function AppMessageEmpty() {
  const { t } = useTranslation();
  return <AppInfoMessage icon={iconMap.error} message={t('error:unknownError')} />;
}
