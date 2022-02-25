import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/state';
import { selectPersona } from '../../store/slices/entities/persona';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../../utils/imageRatio';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { ProfileResponse } from '../../types/service/enevti/profile';
import { getProfileCompleteData } from '../../service/enevti/profile';
import { handleError } from '../../utils/error/handle';
import AppNFTRenderer from '../../components/molecules/nft/AppNFTRenderer';
import AppProfileHeader, {
  APP_PROFILE_HEIGHT_PERCENTAGE,
} from '../../components/organism/profile/AppProfileHeader';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { NFTBase } from '../../types/nft';

type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface MyProfileProps extends Props {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight?: number;
}

export default function MyProfile({ headerHeight }: MyProfileProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyle();
  const myPersona = useSelector((state: RootState) => selectPersona(state));
  const [profileData, setProfileData] = React.useState<ProfileResponse>();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    event => (scrollY.value = event.contentOffset.y),
  );

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -scrollY.value }],
    };
  });

  const onFeedScreenLoaded = async () => {
    try {
      const profile = await getProfileCompleteData(myPersona.address);
      if (profile) {
        setProfileData(profile);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  React.useEffect(() => {
    try {
      onFeedScreenLoaded();
    } catch (err: any) {
      handleError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppView edges={['left', 'right', 'bottom']}>
      <View style={{ height: headerHeight }} />
      <View style={styles.textContainer}>
        <Animated.View
          style={[scrollStyle, { position: 'absolute', zIndex: 1 }]}>
          <AppProfileHeader persona={myPersona} />
        </Animated.View>
        <AnimatedFlatGrid
          onScroll={scrollHandler}
          contentContainerStyle={{
            paddingTop: hp(APP_PROFILE_HEIGHT_PERCENTAGE, insets),
          }}
          spacing={wp('0.5%', insets)}
          showsVerticalScrollIndicator={false}
          itemDimension={wp('30%', insets)}
          data={profileData ? profileData.owned : []}
          renderItem={({ item }) => (
            <AppNFTRenderer nft={item} width={wp('30%', insets)} />
          )}
        />
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
  });
