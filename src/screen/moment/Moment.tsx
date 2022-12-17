import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import AppMomentView from 'enevti-app/components/organism/moment/AppMomentView';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  resetStatusBarState,
  setStatusBarBackground,
  setStatusBarTint,
} from 'enevti-app/store/slices/ui/global/statusbar';

type Props = StackScreenProps<RootStackParamList, 'Moment'>;

export default function Moment({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);
  const pressableHolded = useSharedValue(0);

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
      edges={['left', 'right']}
      headerOffset={0}
      contentContainerStyle={styles.container}
      header={
        <AppHeader
          back
          navigation={navigation}
          title={'Moment'}
          backgroundStyle={styles.background}
          textStyle={headerStyle}
          iconStyle={headerStyle}
        />
      }>
      <AppMomentView
        navigation={navigation}
        route={route}
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
