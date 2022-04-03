import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Collection } from 'enevti-app/types/service/enevti/collection';
import { ProgressBar, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from 'color';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppCountdown from 'enevti-app/components/atoms/date/AppCountdown';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';

export const MINTING_AVAILABLE_VIEW_HEIGHT = 7;

interface AppCollectionMintingAvailableProps {
  collection: Collection;
  onFinish?: () => void;
}

export default function AppCollectionMintingAvailable({
  collection,
  onFinish,
}: AppCollectionMintingAvailableProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const now = React.useMemo(() => Date.now(), []);

  const until = React.useMemo(
    () => Math.floor((collection.minting.expire - now) / 1000),
    [collection.minting.expire, now],
  );
  const mintingProgress = React.useMemo(
    () => collection.stat.minted / collection.minting.total,
    [collection.stat.minted, collection.minting.total],
  );

  return (
    <View style={styles.mintingAvailableView}>
      <View style={styles.mintingAvailableItem}>
        <View>
          <AppTextHeading3>{t('collection:mintingAvailable')}</AppTextHeading3>
          {collection.minting.expire > 0 ? (
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {t('collection:mintingProgress', {
                minted: collection.stat.minted,
                total: collection.minting.total,
              })}
            </AppTextBody4>
          ) : null}
        </View>
      </View>
      <View style={styles.mintingAvailableItem}>
        {collection.minting.expire > 0 ? (
          <AppCountdown until={until} onFinish={onFinish} />
        ) : (
          <View>
            <ProgressBar
              progress={mintingProgress}
              color={theme.colors.text}
              style={styles.progressBar}
            />
            <AppTextBody5 style={styles.progressBarLabel}>
              {t('collection:mintingProgress', {
                minted: collection.stat.minted,
                total: collection.minting.total,
              })}{' '}
              ({(mintingProgress * 100).toFixed(2)}%)
            </AppTextBody5>
          </View>
        )}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    mintingAvailableView: {
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.6).rgb().toString()
        : Color(theme.colors.background).darken(0.12).rgb().toString(),
      flexDirection: 'row',
      height: hp(MINTING_AVAILABLE_VIEW_HEIGHT, insets),
      alignItems: 'center',
      paddingHorizontal: wp('5%', insets),
    },
    mintingAvailableItem: {
      flex: 1,
    },
    progressBar: {
      height: hp('1%', insets),
      borderRadius: theme.roundness,
    },
    progressBarLabel: {
      color: theme.colors.placeholder,
      marginTop: hp('0.5%', insets),
      textAlign: 'right',
    },
  });
