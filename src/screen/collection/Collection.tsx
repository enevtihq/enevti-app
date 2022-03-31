import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import AppView from '../../components/atoms/view/AppView';
import {
  resetStatusBarBackground,
  setStatusBarBackground,
  setStatusBarTint,
} from '../../store/slices/ui/global/statusbar';
import { RootStackParamList } from '../../navigation';
import AppCollection from 'enevti-app/components/organism/collection/AppCollection';
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

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ navigation, route }: Props) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const headerTreshold = React.useMemo(
    () => wp('100%') * 0.5625 - hp(HEADER_HEIGHT_PERCENTAGE),
    [],
  );

  const collectionScroll = useSharedValue(0);

  React.useEffect(() => {
    dispatch(setStatusBarBackground('transparent'));
    dispatch(setStatusBarTint('light'));
    return function cleanup() {
      dispatch(resetStatusBarBackground());
    };
  }, [dispatch]);

  const onHeaderAboveTreshold = React.useCallback(() => {
    dispatch(setStatusBarTint('system'));
  }, [dispatch]);

  const onHeaderBelowTreshold = React.useCallback(
    () => dispatch(setStatusBarTint('light')),
    [dispatch],
  );

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
      color: interpolateColor(
        collectionScroll.value,
        [0, 1],
        ['transparent', theme.colors.text],
      ) as string,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        collectionScroll.value,
        [0, 1],
        ['#ffffff', theme.colors.text],
      ) as string,
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
      edges={['bottom', 'left', 'right']}
      headerOffset={0}
      header={
        <AppHeader
          back
          withAnimatedGradient
          navigation={navigation}
          title={'Collection'}
          backgroundStyle={headerBackgroundStyle}
          textStyle={textStyle}
          iconStyle={iconStyle}
        />
      }>
      <AppCollection id={id} onScrollWorklet={collectionOnScroll} />
    </AppView>
  );
}
