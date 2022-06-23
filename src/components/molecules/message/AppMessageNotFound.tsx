import React from 'react';
import AppInfoMessage from './base/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

export default function AppMessageNotFound() {
  const { t } = useTranslation();
  return <AppInfoMessage icon={iconMap.notFound} message={t('error:notFound')} />;
}
