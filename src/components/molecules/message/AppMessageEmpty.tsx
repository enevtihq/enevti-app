import React from 'react';
import AppInfoMessage from './base/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

interface AppMessageEmptyProps {
  color?: string;
}

export default function AppMessageEmpty({ color }: AppMessageEmptyProps) {
  const { t } = useTranslation();
  return <AppInfoMessage color={color} icon={iconMap.empty} message={t('error:noData')} />;
}
