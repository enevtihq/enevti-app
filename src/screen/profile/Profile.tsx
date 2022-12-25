import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppProfile from 'enevti-app/components/organism/profile/AppProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { hp } from 'enevti-app/utils/layout/imageRatio';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({ navigation, route }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE);
  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'Profile'>;

  return (
    <AppView
      darken
      withModal
      withLoader
      edges={['left', 'right', 'bottom']}
      headerOffset={insets.top}
      header={<AppHeader back navigation={navigation} title={t('home:profile')} />}>
      <View style={styles.textContainer}>
        <AppProfile disableHeaderAnimation navigation={navigation} route={screenRoute} headerHeight={headerHeight} />
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
