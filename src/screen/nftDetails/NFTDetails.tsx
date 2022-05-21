import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { resetStatusBarState, setStatusBarBackground } from 'enevti-app/store/slices/ui/global/statusbar';
import { RootStackParamList } from 'enevti-app/navigation';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { hp } from 'enevti-app/utils/imageRatio';
import { useTranslation } from 'react-i18next';
import AppNFTDetails from 'enevti-app/components/organism/nftDetails/AppNFTDetails';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'NFTDetails'>;

export default function NFTDetails({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const headerTreshold = React.useMemo(
    () => hp(HEADER_HEIGHT_PERCENTAGE) + (getStatusBarHeight() / Dimensions.get('window').height) * 100,
    [],
  );
  const screenRoute = React.useMemo(() => ({ params: route.params }), [route.params]) as RouteProp<
    RootStackParamList,
    'NFTDetails'
  >;

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

  const onHeaderAboveTreshold = React.useCallback(() => {}, []);

  const onHeaderBelowTreshold = React.useCallback(() => {}, []);

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
      color: interpolateColor(nftDetailsScroll.value, [0, 1], ['transparent', theme.colors.text]) as string,
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

  return (
    <AppView
      darken
      withLoader
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
      <AppNFTDetails onScrollWorklet={nftDetailsOnScroll} navigation={navigation} route={screenRoute} />
    </AppView>
  );
}
