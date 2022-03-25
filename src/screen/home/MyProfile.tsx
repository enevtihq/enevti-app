import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from '../../store/slices/entities/cache/myPersona';
import AppProfile from '../../components/organism/profile/AppProfile';
import {
  isMyProfileUndefined,
  selectMyProfileView,
} from '../../store/slices/ui/view/myProfile';

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

  return (
    <AppView darken withLoader edges={['left', 'right', 'bottom']}>
      <View style={styles.textContainer}>
        <AppProfile
          navigation={navigation}
          headerHeight={headerHeight}
          address={myPersona.address}
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
