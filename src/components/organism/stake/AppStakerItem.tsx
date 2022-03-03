import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Theme } from '../../../theme/default';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppAvatarRenderer from '../../molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppListItem from '../../molecules/list/AppListItem';
import { StyleSheet } from 'react-native';
import { StakerItem } from '../../../types/service/enevti/stake';
import { useSelector } from 'react-redux';
import { selectPersona } from '../../../store/slices/entities/persona';
import { parseAmount } from '../../../utils/format/amount';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';

export const STAKER_ITEM_HEIGHT_PERCENTAGE = 10;

interface AppStakerItemProps {
  staker: StakerItem;
}

export default function AppStakerItem({ staker }: AppStakerItemProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets);
  const myPersona = useSelector(selectPersona);

  const onDelete = () => {
    console.log('deleted');
  };

  return (
    <AppListItem
      style={styles.stakerContainer}
      leftContent={
        <AppAvatarRenderer
          address={staker.persona.address}
          photo={staker.persona.photo}
          size={wp('12%', insets)}
          style={styles.avatar}
        />
      }
      rightContent={
        myPersona.address === staker.persona.address ? (
          <AppIconButton
            icon={iconMap.delete}
            onPress={onDelete}
            style={styles.deleteIcon}
          />
        ) : undefined
      }>
      <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
        #{staker.rank.toString()}{' '}
        {staker.persona.username
          ? staker.persona.username
          : staker.persona.address}
      </AppTextHeading3>
      <AppTextBody4
        style={{ color: theme.colors.placeholder }}
        numberOfLines={1}>
        {parseAmount(staker.stake, true, 2)} {getCoinName()} (
        {(staker.portion * 100).toFixed(2)}%)
      </AppTextBody4>
    </AppListItem>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    avatar: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    deleteIcon: {
      alignSelf: 'center',
    },
    stakerContainer: {
      height: hp(STAKER_ITEM_HEIGHT_PERCENTAGE, insets),
    },
  });
