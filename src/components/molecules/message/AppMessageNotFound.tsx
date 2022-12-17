import React from 'react';
import AppInfoMessage from './base/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

interface AppMessageNotFoundProps {
  color?: string;
}

export default function AppMessageNotFound({ color }: AppMessageNotFoundProps) {
  const { t } = useTranslation();
  return <AppInfoMessage color={color} icon={iconMap.notFound} message={t('error:notFound')} />;
}
