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
import AppAvatarRenderer from '../../components/molecules/avatar/AppAvatarRenderer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/state';
import { selectPersona } from '../../store/slices/entities/persona';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp } from '../../utils/imageRatio';

type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

interface MyProfileProps extends Props {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight?: number;
}

export default function MyProfile({ headerHeight }: MyProfileProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyle();
  const myPersona = useSelector((state: RootState) => selectPersona(state));

  return (
    <AppView edges={['left', 'right', 'bottom']}>
      <View style={{ height: headerHeight }} />
      <View style={styles.textContainer}>
        <View>
          <AppAvatarRenderer
            address={myPersona.address}
            photo={myPersona.photo}
            size={wp('50%', insets)}
          />
        </View>
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
      backgroundColor: 'red',
    },
  });
