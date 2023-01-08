import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import AppMomentView from 'enevti-app/components/organism/moment/AppMomentView';
import { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Platform, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  resetStatusBarState,
  setStatusBarBackground,
  setStatusBarTint,
} from 'enevti-app/store/slices/ui/global/statusbar';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type Props = StackScreenProps<RootStackParamList, 'Moment'>;

export default function Moment({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);
  const pressableHolded = useSharedValue(0);

  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'Moment'>;

  const onLoaded = React.useCallback(() => {
    dispatch(setStatusBarBackground('transparent'));
    dispatch(setStatusBarTint('light'));
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

  const headerStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(pressableHolded.value, [0, 1], ['white', 'transparent']) as string,
    };
  });

  const gradientBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pressableHolded.value, [0, 1], [1, 0]),
    };
  });

  const onLongPressWorklet = React.useCallback(() => {
    'worklet';
    pressableHolded.value = withTiming(1, { duration: 250 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLongPressOutWorklet = React.useCallback(() => {
    'worklet';
    pressableHolded.value = withTiming(0, { duration: 250 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppView
      darken
      withLoader
      withModal
      edges={Platform.OS === 'ios' ? ['left', 'right'] : undefined}
      headerOffset={0}
      contentContainerStyle={styles.container}
      header={
        <AppHeader
          back
          withAnimatedGradient
          gradientBackgroundStyle={gradientBackgroundStyle}
          gradientBackgroundAlpha={0.25}
          navigation={navigation}
          title={t('moment:momentScreenTitle')}
          backgroundStyle={styles.background}
          textStyle={headerStyle}
          iconStyle={headerStyle}
          marginTop={Platform.OS === 'android' ? 0 : undefined}
        />
      }>
      <AppMomentView
        navigation={navigation}
        route={screenRoute}
        onLongPressWorklet={onLongPressWorklet}
        onLongPressOutWorklet={onLongPressOutWorklet}
      />
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    background: {
      backgroundColor: 'transparent',
    },
    container: {
      backgroundColor: 'black',
    },
  });
