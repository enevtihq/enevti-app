import React from 'react';
import AppInfoMessage from './base/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

interface AppMessageNoInternetProps {
  color?: string;
}

export default function AppMessageNoInternet({ color }: AppMessageNoInternetProps) {
  const { t } = useTranslation();
  return <AppInfoMessage color={color} icon={iconMap.noInternet} message={t('network:noInternet')} />;
}
