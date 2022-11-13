import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Theme } from 'enevti-app/theme/default';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import { StyleSheet } from 'react-native';
import { StakerItem } from 'enevti-app/types/core/chain/stake';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

export const STAKER_ITEM_HEIGHT_PERCENTAGE = 10;

interface AppStakerItemProps {
  staker: StakerItem;
}

export default function AppStakerItem({ staker }: AppStakerItemProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const myPersona = useSelector(selectMyPersonaCache);

  const onDelete = () => {
    dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }));
  };

  return (
    <AppListItem
      style={styles.stakerContainer}
      leftContent={<AppAvatarRenderer persona={staker.persona} size={wp('12%', insets)} style={styles.avatar} />}
      rightContent={
        myPersona.address === staker.persona.address ? (
          <AppIconButton size={20} icon={iconMap.delete} onPress={onDelete} style={styles.deleteIcon} />
        ) : undefined
      }>
      <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
        #{staker.rank.toString()} {staker.persona.username ? staker.persona.username : staker.persona.address}
      </AppTextHeading3>
      <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
        {parseAmount(staker.stake, true, 2)} {getCoinName()} ({(staker.portion / 100).toFixed(2)}%)
      </AppTextBody4>
    </AppListItem>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
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
