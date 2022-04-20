import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { Collection } from 'enevti-app/types/core/chain/collection';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from 'color';
import { useTranslation } from 'react-i18next';
import { numberKMB, parseAmount } from 'enevti-app/utils/format/amount';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppCurrencyIcon from 'enevti-app/components/atoms/icon/AppCurrencyIcon';

interface AppCollectionDescriptionModalProps {
  collection: Collection;
  visible: boolean;
  onDismiss: () => void;
}

export default function AppCollectionDescriptionModal({
  collection,
  visible,
  onDismiss,
}: AppCollectionDescriptionModalProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const snapPoints = React.useMemo(() => ['75%'], []);
  return (
    <AppMenuContainer
      tapEverywhereToDismiss
      enablePanDownToClose
      snapPoints={snapPoints}
      visible={visible}
      onDismiss={onDismiss}>
      <View
        style={{
          paddingVertical: wp('2%', insets),
          paddingHorizontal: wp('5%', insets),
        }}>
        <AppTextHeading2>
          {collection.name}{' '}
          <AppTextBody3 style={{ color: theme.colors.placeholder }}>
            ({collection.symbol})
          </AppTextBody3>
        </AppTextHeading2>

        <View style={styles.collectionStatsContainer}>
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {numberKMB(collection.stat.minted, 2)}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statItem')}
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {collection.stat.owner}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statOwners')}
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <View style={styles.collectionCurrency}>
              <AppCurrencyIcon
                currency={collection.stat.floor.currency}
                size={15}
                style={styles.collectionCurrencyIcon}
              />
              <AppTextHeading3 numberOfLines={1}>
                {parseAmount(collection.stat.floor.amount, true, 2)}
              </AppTextHeading3>
            </View>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statFloorPrice')}
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {collection.stat.redeemed}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statRedeemed')}
            </AppTextBody4>
          </View>
        </View>

        <AppTextBody4>{collection.description}</AppTextBody4>
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    collectionStatsContainer: {
      flexDirection: 'row',
      marginVertical: hp('2%', insets),
      height: hp('5.2%', insets),
    },
    collectionStatsItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    collectionCurrency: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    collectionCurrencyIcon: {
      marginLeft: -5,
    },
    collectionStatsDivider: {
      height: '50%',
      alignSelf: 'center',
      borderWidth: 0.3,
      borderColor: Color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
    },
  });
