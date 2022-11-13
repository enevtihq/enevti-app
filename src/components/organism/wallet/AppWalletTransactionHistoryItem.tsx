import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppActivityIcon from 'enevti-app/components/molecules/activity/AppActivityIcon';
import moment from 'moment';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { commifyAmount } from 'enevti-app/utils/primitive/string';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import { ProfileActivity } from 'enevti-app/types/core/account/profile';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { useTranslation } from 'react-i18next';
import Color from 'color';

export const TRANSACTION_HISTORY_ITEM_HEIGHT = 9;
const AMOUNT_LENGTH_LIMIT = 10;

const AVATAR_ACTION = ['tokenReceived', 'tokenSent'];
const BALANCE_PLUS_ACTION = ['tokenReceived', 'NFTSale', 'deliverSecret'];
const BALANCE_MINUS_ACTION = ['tokenSent', 'registerUsername', 'addStake', 'selfStake', 'mintNFT'];
const BALANCE_NOAMOUNT_ACTION = ['createNFT'];
const BALANCE_WITH_FEE = BALANCE_MINUS_ACTION.concat(BALANCE_NOAMOUNT_ACTION);

interface AppWalletTransactionHistoryItemProps {
  item: ProfileActivity;
}

export default function AppWalletTransactionHistoryItem({ item }: AppWalletTransactionHistoryItemProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const now = React.useMemo(() => Date.now(), []);

  const fee = React.useMemo(() => {
    if (BALANCE_WITH_FEE.includes(item.name)) {
      return {
        type: 'withFee',
        value: item.fee,
      };
    } else {
      return {
        type: 'noFee',
        value: '0',
      };
    }
  }, [item.fee, item.name]);

  const amount = React.useMemo(() => {
    if (BALANCE_NOAMOUNT_ACTION.includes(item.name)) {
      return {
        type: 'noamount',
        value: '0',
      };
    } else {
      const itemAmount = parseAmount(item.value.amount, false, 4);
      const value =
        itemAmount.length > AMOUNT_LENGTH_LIMIT ? parseAmount(item.value.amount, true, 4) : commifyAmount(itemAmount);
      return {
        type: BALANCE_PLUS_ACTION.includes(item.name)
          ? 'plus'
          : BALANCE_MINUS_ACTION.includes(item.name)
          ? 'minus'
          : 'unknown',
        value: value,
      };
    }
  }, [item.name, item.value.amount]);

  const timestamp = React.useMemo(
    () => (now - item.date > 86400000 ? moment(item.date).format('DD MMM YYYY') : moment(item.date).fromNow()),
    [now, item.date],
  );

  const action = React.useMemo(() => {
    if (AVATAR_ACTION.includes(item.name)) {
      return parsePersonaLabel(item.name === 'tokenSent' ? item.to : item.from);
    } else {
      return t(`wallet:${item.name}` as any);
    }
  }, [item.from, item.name, item.to, t]);

  const styles = React.useMemo(() => makeStyles(theme, insets, amount.type), [theme, insets, amount.type]);

  const LeftContent = React.useCallback(() => {
    if (AVATAR_ACTION.includes(item.name)) {
      if (item.name === 'tokenSent') {
        return <AppAvatarRenderer persona={item.to} size={wp('12%', insets)} style={styles.avatar} />;
      } else {
        return <AppAvatarRenderer persona={item.from} size={wp('12%', insets)} style={styles.avatar} />;
      }
    } else {
      return <AppActivityIcon activityName={item.name} style={styles.activityIcon} />;
    }
  }, [insets, item, styles.avatar, styles.activityIcon]);

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
          {!['noamount', 'unknown'].includes(amount.type) ? (
            <AppTextBody4 numberOfLines={1} style={styles.collectionRightText}>
              {amount.type === 'minus' ? '-' : '+'}
              {amount.value} <AppTextBody5 style={styles.collectionRightText}>{getCoinName()}</AppTextBody5>
            </AppTextBody4>
          ) : null}
          {!['noFee'].includes(fee.type) ? (
            <AppTextBody5 style={styles.collectionRightSubText}>
              {t('wallet:feeAmount', { amount: parseAmount(fee.value), currency: getCoinName() })}
            </AppTextBody5>
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
      flex: ['noamount', 'unknown'].includes(type) ? 0 : 1,
    },
    collectionRightText: {
      textAlign: 'right',
      color: type === 'minus' ? theme.colors.error : type === 'plus' ? theme.colors.success : undefined,
    },
    collectionRightSubText: {
      textAlign: 'right',
      color: Color(theme.colors.placeholder).alpha(0.25).rgb().toString(),
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
