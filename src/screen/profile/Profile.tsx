import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppProfile from '../../components/organism/profile/AppProfile';
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

  return (
    <AppView
      darken
      withModal
      withLoader
      edges={['left', 'right', 'bottom']}
      headerOffset={0}
      header={
        <AppHeader back navigation={navigation} title={t('home:profile')} />
      }>
      <View style={styles.textContainer}>
        <AppProfile
          disableHeaderAnimation
          navigation={navigation}
          headerHeight={headerHeight}
          address={address}
          profile={profile}
          profileUndefined={profileUndefined}
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
