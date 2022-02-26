import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import color from 'color';
import { Theme } from '../../../theme/default';
import { hp, wp } from '../../../utils/imageRatio';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';

export default function AppListItem() {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;

  return (
    <View
      style={{
        marginHorizontal: wp('5%', insets),
        marginBottom: wp('3%', insets),
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: color(theme.colors.text).alpha(0.05).rgb().toString(),
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: wp('2%', insets),
          paddingHorizontal: wp('3%', insets),
        }}>
        <AppAvatarRenderer
          size={wp('16%', insets)}
          style={{ marginRight: wp('2%', insets) }}
        />
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <AppTextHeading3
            style={{ marginBottom: hp('0.5%', insets) }}
            numberOfLines={1}>
            #1 aldhosutra
          </AppTextHeading3>
          <AppTextBody5
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            2503 $ENVT (21.34%)
          </AppTextBody5>
        </View>
        <AppIconButton
          icon={iconMap.delete}
          onPress={() => {}}
          style={{ alignSelf: 'center' }}
        />
      </View>
    </View>
  );
}
