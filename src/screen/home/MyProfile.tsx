import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppProfile from 'enevti-app/components/organism/profile/AppProfile';
import { isMyProfileUndefined, selectMyProfileView } from 'enevti-app/store/slices/ui/view/myProfile';
import { RouteProp } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

interface MyProfileProps extends Props {
  onScrollWorklet: (val: number) => void;
  onBeginDragWorklet: (val: number) => void;
  onEndDragWorklet: (val: number) => void;
  onMomentumEndWorklet: (val: number) => void;
  headerHeight?: number;
}

export default function MyProfile({
  navigation,
  onScrollWorklet,
  onBeginDragWorklet,
  onEndDragWorklet,
  onMomentumEndWorklet,
  headerHeight = 0,
}: MyProfileProps) {
  const styles = React.useMemo(() => makeStyles(), []);
  const myPersona = useSelector(selectMyPersonaCache);
  const profile = useSelector(selectMyProfileView);
  const profileUndefined = useSelector(isMyProfileUndefined);
  const myRoute = React.useMemo(
    () => ({ params: { arg: myPersona.address, mode: 'a' } }),
    [myPersona.address],
  ) as RouteProp<RootStackParamList, 'Profile'>;

  return (
    <AppView darken withLoader edges={['left', 'right', 'bottom', 'top']}>
      <View style={styles.textContainer}>
        <AppProfile
          isMyProfile
          navigation={navigation}
          route={myRoute}
          headerHeight={headerHeight}
          profile={profile}
          profileUndefined={profileUndefined}
          onScrollWorklet={onScrollWorklet}
          onBeginDragWorklet={onBeginDragWorklet}
          onEndDragWorklet={onEndDragWorklet}
          onMomentumEndWorklet={onMomentumEndWorklet}
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
