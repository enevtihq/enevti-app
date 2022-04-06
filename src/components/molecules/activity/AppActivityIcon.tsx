import { StyleSheet } from 'react-native';
import React from 'react';
import AppIconComponent, {
  iconMap,
  UNDEFINED_ICON,
} from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';

const activityNameIcon = {
  sale: iconMap.accountCircle,
};

interface AppActivityIconProps {
  activityName: string;
}

export default function AppActivityIcon({
  activityName,
}: AppActivityIconProps) {
  const theme = useTheme();
  const { wp } = useDimension();
  const styles = React.useMemo(() => makeStyles(wp), [wp]);
  const iconName =
    activityName in activityNameIcon
      ? (activityNameIcon as any)[activityName]
      : UNDEFINED_ICON;

  return (
    <AppIconComponent
      name={iconName}
      size={35}
      color={theme.colors.placeholder}
      style={styles.activityIcon}
    />
  );
}

const makeStyles = (wp: DimensionFunction) =>
  StyleSheet.create({
    activityIcon: {
      width: wp('13%'),
      marginLeft: wp('2%'),
      alignSelf: 'center',
    },
  });
