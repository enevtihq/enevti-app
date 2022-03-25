import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppProfile from '../../components/organism/profile/AppProfile';
import { diffClamp } from '../../utils/animation';
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader, {
  HEADER_HEIGHT_PERCENTAGE,
} from '../../components/atoms/view/AppHeader';
import { hp } from '../../utils/imageRatio';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  isProfileUndefined,
  selectProfileView,
} from '../../store/slices/ui/view/profile';

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({ navigation, route }: Props) {
  const { address } = route.params;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);

  const profile = useSelector(selectProfileView);
  const profileUndefined = useSelector(isProfileUndefined);

  const tabScrollY = useSharedValue(0);
  const profilePrevY = useSharedValue(0);
  const profileInterpolatedY = useSharedValue(0);

  const myProfileOnScrollWorklet = React.useCallback((val: number) => {
    'worklet';
    const diff = val - profilePrevY.value;
    tabScrollY.value = diffClamp(
      profileInterpolatedY.value + diff,
      0,
      headerHeight + insets.top,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myProfileOnBeginDragWorklet = React.useCallback((val: number) => {
    'worklet';
    profilePrevY.value = val;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myProfileOnEndDragWorklet = React.useCallback((val: number) => {
    'worklet';
    if (
      tabScrollY.value < (headerHeight + insets.top) / 2 ||
      val < headerHeight + insets.top
    ) {
      tabScrollY.value = withTiming(0, { duration: 200 });
      profileInterpolatedY.value = 0;
    } else {
      tabScrollY.value = withTiming(headerHeight + insets.top, {
        duration: 200,
      });
      profileInterpolatedY.value = headerHeight + insets.top;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            tabScrollY.value,
            [0, headerHeight + insets.top],
            [0, -(headerHeight + insets.top)],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <AppView darken withModal withLoader edges={['left', 'right', 'bottom']}>
      <AppHeader
        back
        navigation={navigation}
        title={t('home:profile')}
        style={headerStyle}
        height={headerHeight}
      />
      <View style={styles.textContainer}>
        <AppProfile
          navigation={navigation}
          headerHeight={headerHeight}
          address={address}
          profile={profile}
          profileUndefined={profileUndefined}
          onScrollWorklet={myProfileOnScrollWorklet}
          onBeginDragWorklet={myProfileOnBeginDragWorklet}
          onEndDragWorklet={myProfileOnEndDragWorklet}
          onMomentumEndWorklet={myProfileOnEndDragWorklet}
        />
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
  });
