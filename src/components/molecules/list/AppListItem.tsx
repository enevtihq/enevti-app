import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { Theme } from '../../../theme/default';
import { wp } from '../../../utils/imageRatio';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppTextBody4 from '../../atoms/text/AppTextBody4';

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
        borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
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
          <AppTextHeading3 numberOfLines={1}>#1 aldhosutra</AppTextHeading3>
          <AppTextBody4
            style={{ color: theme.colors.placeholder }}
            numberOfLines={1}>
            2503 $ENVT (21.34%)
          </AppTextBody4>
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
