import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppIconComponent from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import activityToIcon from 'enevti-app/utils/icon/activityToIcon';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';

interface AppActivityIconProps {
  activityName: string;
}

export default function AppActivityIcon({
  activityName,
}: AppActivityIconProps) {
  const theme = useTheme() as Theme;
  const { wp } = useDimension();
  const styles = React.useMemo(() => makeStyles(wp, theme), [wp, theme]);

  return (
    <View style={styles.activityIconView}>
      <AppIconComponent
        name={activityToIcon(activityName)}
        size={20}
        color={theme.colors.placeholder}
        style={styles.activityIcon}
      />
    </View>
  );
}

const makeStyles = (wp: DimensionFunction, theme: Theme) =>
  StyleSheet.create({
    activityIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    activityIconView: {
      marginLeft: wp('2%'),
      marginRight: wp('3%'),
      width: wp('10%'),
      height: wp('10%'),
      alignSelf: 'center',
      borderRadius: wp('10%'),
      backgroundColor: Color(theme.colors.placeholder)
        .alpha(0.05)
        .rgb()
        .toString(),
    },
  });
