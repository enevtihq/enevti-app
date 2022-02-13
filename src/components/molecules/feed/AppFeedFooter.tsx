import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import AppTextHeading4 from '../../atoms/text/AppTextHeading4';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useTranslation } from 'react-i18next';

export default function AppFeedFooter() {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets, theme);

  return (
    <View style={styles.footerContainer}>
      <Text numberOfLines={2} style={styles.description}>
        <AppTextHeading4>EyeCollection</AppTextHeading4>
        <AppTextHeading4> | </AppTextHeading4>
        <AppTextBody4>
          to celebrate our 2021 newest cat, we release new NFT collection with
          tons of utility that you can experience with your own eyes
        </AppTextBody4>
      </Text>
      <Text>
        <AppTextHeading4 style={styles.tag}>
          {t('home:collection')}
        </AppTextHeading4>
        <AppTextBody4 style={styles.tag}> | </AppTextBody4>
        <AppTextBody4 style={styles.tag}>
          {t('home:mintingProgress', { minted: '21', total: '321' })}
        </AppTextBody4>
        <AppTextBody4 style={styles.tag}> | </AppTextBody4>
        <AppTextBody4 style={styles.tag}>
          {t('home:daysLeft', { day: '12' })}
        </AppTextBody4>
      </Text>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets, theme: Theme) =>
  StyleSheet.create({
    footerContainer: {
      paddingHorizontal: wp('3%', insets),
      paddingBottom: wp('3%', insets),
    },
    tag: {
      color: theme.colors.primary,
    },
    description: {
      marginBottom: wp('2%', insets),
    },
  });