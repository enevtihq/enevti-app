import { StyleSheet, View } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from '../../../types/nft';
import { PersonaBase } from '../../../types/service/enevti/persona';
import { ProfileResponse } from '../../../types/service/enevti/profile';
import AppProfileHeader, {
  APP_PROFILE_HEIGHT_PERCENTAGE,
} from './AppProfileHeader';
import { hp, wp } from '../../../utils/imageRatio';
import AppNFTRenderer from '../../molecules/nft/AppNFTRenderer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation';

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface AppProfileProps {
  navigation: StackNavigationProp<RootStackParamList>;
  persona: PersonaBase;
  onScrollWorklet?: (val: number) => void;
  onBeginDragWorklet?: (val: number) => void;
  onEndDragWorklet?: (val: number) => void;
  onMomentumEndWorklet?: (val: number) => void;
  profile?: ProfileResponse;
  headerHeight?: number;
}

export default function AppProfile({
  navigation,
  persona,
  profile,
  onScrollWorklet,
  onBeginDragWorklet,
  onEndDragWorklet,
  onMomentumEndWorklet,
  headerHeight = 0,
}: AppProfileProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyle(headerHeight);

  const rawScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      rawScrollY.value = event.contentOffset.y;
      onScrollWorklet && onScrollWorklet(event.contentOffset.y);
    },
    onBeginDrag: event => {
      onBeginDragWorklet && onBeginDragWorklet(event.contentOffset.y);
    },
    onEndDrag: event => {
      onEndDragWorklet && onEndDragWorklet(event.contentOffset.y);
    },
    onMomentumEnd: event => {
      onMomentumEndWorklet && onMomentumEndWorklet(event.contentOffset.y);
    },
  });

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -rawScrollY.value }],
    };
  });

  return (
    <View>
      <Animated.View style={[styles.profileHeader, scrollStyle]}>
        <AppProfileHeader persona={persona} navigation={navigation} />
      </Animated.View>
      <AnimatedFlatGrid
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: hp(APP_PROFILE_HEIGHT_PERCENTAGE, insets) + headerHeight,
        }}
        spacing={wp('0.5%', insets)}
        showsVerticalScrollIndicator={false}
        itemDimension={wp('30%', insets)}
        data={profile ? profile.owned : []}
        renderItem={({ item }) => (
          <AppNFTRenderer nft={item} width={wp('30%', insets)} />
        )}
      />
    </View>
  );
}

const makeStyle = (headerHeight: number) =>
  StyleSheet.create({
    profileHeader: {
      position: 'absolute',
      zIndex: 1,
      paddingTop: headerHeight,
    },
  });
