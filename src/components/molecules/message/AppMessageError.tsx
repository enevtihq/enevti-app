import React from 'react';
import AppInfoMessage from './base/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

interface AppMessageErrorProps {
  color?: string;
}

export default function AppMessageError({ color }: AppMessageErrorProps) {
  const { t } = useTranslation();
  return <AppInfoMessage color={color} icon={iconMap.error} message={t('error:unknownError')} />;
}
