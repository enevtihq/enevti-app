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

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface AppProfileProps {
  persona: PersonaBase;
  scrollWorklet?: (val: number) => void;
  profile?: ProfileResponse;
  headerHeight?: number;
}

export default function AppProfile({
  persona,
  profile,
  scrollWorklet,
  headerHeight = 0,
}: AppProfileProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyle(headerHeight);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
    scrollWorklet && scrollWorklet(event.contentOffset.y);
  });

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -scrollY.value }],
    };
  });

  return (
    <View>
      <Animated.View style={[styles.profileHeader, scrollStyle]}>
        <AppProfileHeader persona={persona} />
      </Animated.View>
      <AnimatedFlatGrid
        onScroll={scrollHandler}
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
