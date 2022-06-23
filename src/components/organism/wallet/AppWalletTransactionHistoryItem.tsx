import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { useTranslation } from 'react-i18next';
import { TransactionServiceItem } from 'enevti-app/types/core/service/wallet';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppActivityIcon from 'enevti-app/components/molecules/activity/AppActivityIcon';
import moment from 'moment';
import chainDateToUI from 'enevti-app/utils/date/chainDateToUI';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { commifyAmount } from 'enevti-app/utils/primitive/string';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { getCoinName } from 'enevti-app/utils/constant/identifier';

export const TRANSACTION_HISTORY_ITEM_HEIGHT = 9;
const AMOUNT_LENGTH_LIMIT = 10;

interface AppWalletTransactionHistoryItemProps {
  item: TransactionServiceItem;
}

export default function AppWalletTransactionHistoryItem({ item }: AppWalletTransactionHistoryItemProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const myPersona = useSelector(selectMyPersonaCache);
  const now = React.useMemo(() => Date.now(), []);

  const amount = React.useMemo(() => {
    if (item.moduleAssetName === 'token:transfer') {
      const value = parseAmount((item.asset as { amount: string }).amount, false, 4);
      if (myPersona.base32 === item.sender.address) {
        return {
          type: 'send',
          value:
            value.length > AMOUNT_LENGTH_LIMIT
              ? parseAmount((item.asset as { amount: string }).amount, true, 4)
              : commifyAmount(value),
        };
      } else {
        return {
          type: 'receive',
          value:
            value.length > AMOUNT_LENGTH_LIMIT
              ? parseAmount((item.asset as { amount: string }).amount, true, 4)
              : commifyAmount(value),
        };
      }
    } else {
      return { type: 'general', value: '0' };
    }
  }, [item.asset, item.moduleAssetName, item.sender.address, myPersona.base32]);

  const timestamp = React.useMemo(
    () =>
      now - item.block.timestamp * 1000 > 86400
        ? moment(chainDateToUI(item.block.timestamp)).format('DD MMM YYYY')
        : moment(chainDateToUI(item.block.timestamp)).fromNow(),
    [now, item.block.timestamp],
  );

  const action = React.useMemo(() => {
    if (item.moduleAssetName === 'token:transfer') {
      if (myPersona.base32 === item.sender.address) {
        return t('wallet:sendToken');
      } else {
        return t('wallet:receiveToken');
      }
    } else {
      return item.moduleAssetName;
    }
  }, [t, item.moduleAssetName, item.sender.address, myPersona.base32]);

  const styles = React.useMemo(() => makeStyles(theme, insets, amount.type), [theme, insets, amount.type]);

  const LeftContent = React.useCallback(() => {
    if (item.moduleAssetName === 'token:transfer') {
      if (myPersona.base32 === item.sender.address) {
        return (
          <AppAvatarRenderer
            base32={(item.asset as { recipient: { address: string } }).recipient.address}
            size={wp('12%', insets)}
            style={styles.avatar}
          />
        );
      } else {
        return <AppAvatarRenderer base32={item.sender.address} size={wp('12%', insets)} style={styles.avatar} />;
      }
    } else {
      return <AppActivityIcon activityName={item.moduleAssetName} style={styles.activityIcon} />;
    }
  }, [insets, item, myPersona.base32, styles.avatar, styles.activityIcon]);

  return (
    <AppListItem
      style={styles.collectionItem}
      leftContent={
        <View style={styles.collectionCoverContainer}>
          <LeftContent />
        </View>
      }
      rightContent={
        <View style={styles.collectionRightContent}>
          {amount.type !== 'general' ? (
            <AppTextBody4 numberOfLines={1} style={styles.collectionRightText}>
              {amount.type === 'send' ? '-' : '+'}
              {amount.value} <AppTextBody5 style={styles.collectionRightText}>{getCoinName()}</AppTextBody5>
            </AppTextBody4>
          ) : null}
        </View>
      }>
      <AppTextHeading3 numberOfLines={1}>{action}</AppTextHeading3>
      <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={2}>
        {timestamp}
      </AppTextBody4>
    </AppListItem>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, type: string) =>
  StyleSheet.create({
    avatar: {
      alignSelf: 'center',
    },
    collectionItem: {
      height: hp(TRANSACTION_HISTORY_ITEM_HEIGHT, insets),
    },
    collectionRightContent: {
      justifyContent: 'center',
      flex: type === 'general' ? 0 : 1,
    },
    collectionRightText: {
      textAlign: 'right',
      color: type === 'send' ? theme.colors.error : type === 'receive' ? theme.colors.success : undefined,
    },
    collectionCoverContainer: {
      marginRight: wp('3%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
    collectionCover: {
      width: wp('14%', insets),
      height: wp('14%', insets),
    },
    activityIcon: {
      marginRight: 0,
      marginLeft: 0,
      width: wp('12%', insets),
      height: wp('12%', insets),
    },
  });
