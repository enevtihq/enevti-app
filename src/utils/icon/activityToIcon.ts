import {
  iconMap,
  UNDEFINED_ICON,
} from 'enevti-app/components/atoms/icon/AppIconComponent';

const iconMappings = {
  sale: iconMap.accountCircle,
};

export default function activityToIcon(activity: string) {
  return activity in iconMappings
    ? (iconMappings as any)[activity]
    : UNDEFINED_ICON;
}
