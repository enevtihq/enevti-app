import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import AppView from 'enevti-app/components/atoms/view/AppView';
import {
  resetStatusBarState,
  setStatusBarBackground,
  setStatusBarTint,
} from 'enevti-app/store/slices/ui/global/statusbar';
import { RootStackParamList } from 'enevti-app/navigation';
import AppCollection from 'enevti-app/components/organism/collection/AppCollection';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const headerTreshold = React.useMemo(() => wp('100%') * 0.5625 - hp(HEADER_HEIGHT_PERCENTAGE), []);
  const isAboveTreshold = React.useRef<boolean>(false);
  const screenRoute = React.useMemo(() => ({ params: route.params }), [route.params]) as RouteProp<
    RootStackParamList,
    'Collection'
  >;

  const collectionScroll = useSharedValue(0);

  const onLoaded = React.useCallback(() => {
    dispatch(setStatusBarBackground('transparent'));
    dispatch(setStatusBarTint('light'));
  }, [dispatch]);

  const onLoadedAbove = React.useCallback(() => {
    dispatch(setStatusBarBackground('transparent'));
    dispatch(setStatusBarTint('system'));
  }, [dispatch]);

  React.useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      dispatch(resetStatusBarState());
    });
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (isAboveTreshold.current) {
        onLoadedAbove();
      } else {
        onLoaded();
      }
    });
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, dispatch, onLoaded, onLoadedAbove]);

  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  const onHeaderAboveTreshold = React.useCallback(() => {
    isAboveTreshold.current = true;
    dispatch(setStatusBarTint('system'));
  }, [dispatch]);

  const onHeaderBelowTreshold = React.useCallback(() => {
    isAboveTreshold.current = false;
    dispatch(setStatusBarTint('light'));
  }, [dispatch]);

  const headerBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        collectionScroll.value,
        [0, 1],
        ['transparent', theme.colors.background],
      ) as string,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(collectionScroll.value, [0, 1], ['transparent', theme.colors.text]) as string,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(collectionScroll.value, [0, 1], ['#ffffff', theme.colors.text]) as string,
    };
  });

  const collectionOnScroll = React.useCallback((val: number) => {
    'worklet';
    if (val > headerTreshold && collectionScroll.value === 0) {
      collectionScroll.value = withTiming(1, { duration: 200 });
      runOnJS(onHeaderAboveTreshold)();
    } else if (val <= headerTreshold && collectionScroll.value === 1) {
      collectionScroll.value = withTiming(0, { duration: 200 });
      runOnJS(onHeaderBelowTreshold)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          withAnimatedGradient
          navigation={navigation}
          title={t('collection:headerTitle')}
          backgroundStyle={headerBackgroundStyle}
          textStyle={textStyle}
          iconStyle={iconStyle}
        />
      }>
      <AppCollection onScrollWorklet={collectionOnScroll} navigation={navigation} route={screenRoute} />
    </AppView>
  );
}
