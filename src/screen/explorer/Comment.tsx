import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';
import AppComment from 'enevti-app/components/organism/comment/AppComment';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';

type Props = StackScreenProps<RootStackParamList, 'Comment'>;

export default function Comment({ navigation, route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'Comment'>;

  return (
    <AppView
      darken
      withModal
      withPayment
      navigation={navigation}
      edges={['left', 'bottom', 'right']}
      contentContainerStyle={styles.view}
      header={<AppHeader back navigation={navigation} title={t('explorer:commentTitle')} />}>
      <View style={styles.container}>
        <AppComment navigation={navigation} route={screenRoute} />
      </View>
    </AppView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    view: {
      backgroundColor: theme.colors.background,
    },
  });
