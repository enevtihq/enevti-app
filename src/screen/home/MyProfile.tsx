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
import { ProfileResponse } from '../../types/service/enevti/profile';
import { getProfileCompleteData } from '../../service/enevti/profile';
import { handleError } from '../../utils/error/handle';
import AppProfile from '../../components/organism/profile/AppProfile';

type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

interface MyProfileProps extends Props {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight?: number;
  scrollWorklet: (val: number) => void;
}

export default function MyProfile({
  headerHeight = 0,
  scrollWorklet,
}: MyProfileProps) {
  const styles = makeStyle();
  const myPersona = useSelector((state: RootState) => selectPersona(state));
  const [profileData, setProfileData] = React.useState<ProfileResponse>();

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
      <View style={styles.textContainer}>
        <AppProfile
          headerHeight={headerHeight}
          persona={myPersona}
          profile={profileData}
          scrollWorklet={scrollWorklet}
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
