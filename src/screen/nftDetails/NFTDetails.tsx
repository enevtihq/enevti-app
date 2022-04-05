import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import AppView from 'enevti-app/components/atoms/view/AppView';
import {
  resetStatusBarState,
  setStatusBarBackground,
} from 'enevti-app/store/slices/ui/global/statusbar';
import { RootStackParamList } from 'enevti-app/navigation';
import AppHeader, {
  HEADER_HEIGHT_PERCENTAGE,
} from 'enevti-app/components/atoms/view/AppHeader';
import {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import { useTranslation } from 'react-i18next';
import AppNFTDetails from 'enevti-app/components/organism/nftDetails/AppNFTDetails';

type Props = StackScreenProps<RootStackParamList, 'NFTDetails'>;

export default function NFTDetails({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { id } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const headerTreshold = React.useMemo(
    () => wp('100%') * 0.5625 - hp(HEADER_HEIGHT_PERCENTAGE),
    [],
  );

  const nftDetailsScroll = useSharedValue(0);

  const onLoaded = React.useCallback(() => {
    dispatch(setStatusBarBackground('transparent'));
  }, [dispatch]);

  React.useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      dispatch(resetStatusBarState());
    });
    const unsubscribeFocus = navigation.addListener('focus', () => {
      onLoaded();
    });
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, dispatch, onLoaded]);

  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  const onHeaderAboveTreshold = React.useCallback(() => {
    dispatch(setStatusBarBackground('system'));
  }, [dispatch]);

  const onHeaderBelowTreshold = React.useCallback(
    () => dispatch(setStatusBarBackground('transparent')),
    [dispatch],
  );

  const headerBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        nftDetailsScroll.value,
        [0, 1],
        ['transparent', theme.colors.background],
      ) as string,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        nftDetailsScroll.value,
        [0, 1],
        ['transparent', theme.colors.text],
      ) as string,
    };
  });

  const nftDetailsOnScroll = React.useCallback((val: number) => {
    'worklet';
    if (val > headerTreshold && nftDetailsScroll.value === 0) {
      nftDetailsScroll.value = withTiming(1, { duration: 200 });
      runOnJS(onHeaderAboveTreshold)();
    } else if (val <= headerTreshold && nftDetailsScroll.value === 1) {
      nftDetailsScroll.value = withTiming(0, { duration: 200 });
      runOnJS(onHeaderBelowTreshold)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(id, nftDetailsOnScroll);

  return (
    <AppView
      darken
      withModal
      withLoader
      withPayment
      edges={['bottom', 'left', 'right']}
      headerOffset={0}
      header={
        <AppHeader
          back
          navigation={navigation}
          title={t('nftDetails:headerTitle')}
          backgroundStyle={headerBackgroundStyle}
          textStyle={textStyle}
        />
      }>
      <AppNFTDetails
        id={id}
        onScrollWorklet={nftDetailsOnScroll}
        navigation={navigation}
      />
    </AppView>
  );
}