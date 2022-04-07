import { StyleSheet } from 'react-native';
import React from 'react';
import AppIconComponent from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import activityToIcon from 'enevti-app/utils/icon/activityToIcon';

interface AppActivityIconProps {
  activityName: string;
}

export default function AppActivityIcon({
  activityName,
}: AppActivityIconProps) {
  const theme = useTheme();
  const { wp } = useDimension();
  const styles = React.useMemo(() => makeStyles(wp), [wp]);

  return (
    <AppIconComponent
      name={activityToIcon(activityName)}
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
