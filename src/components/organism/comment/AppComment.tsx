import { View, StyleSheet } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppTopTabBar from 'enevti-app/components/atoms/view/AppTopTabBar';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { BackgroundColorContext } from 'enevti-app/context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import AppCommentTabs from './AppCommentTabs';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

const Tab = createMaterialTopTabNavigator();

interface AppCommentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Comment'>;
}

export default function AppComment({ navigation, route }: AppCommentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const backgroundColor = React.useContext(BackgroundColorContext);
  const styles = React.useMemo(() => makeStyles(), []);

  const commonCommentScreen = React.useCallback(
    () => <AppCommentTabs navigation={navigation} route={route} type={'common'} />,
    [navigation, route],
  );
  const clubsCommentScreen = React.useCallback(
    () => <AppCommentTabs navigation={navigation} route={route} type={'clubs'} />,
    [navigation, route],
  );

  return (
    <View style={[styles.profileBody]}>
      <Tab.Navigator
        tabBar={props => <AppTopTabBar {...props} />}
        sceneContainerStyle={{ backgroundColor: backgroundColor }}
        screenOptions={{
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: theme.colors.background,
          },
        }}>
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>{t('explorer:commonComment')}</AppTextBody4>
            ),
          }}
          name={t('explorer:commonComment')}
          component={commonCommentScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ color }) => (
              <AppTextBody4 style={{ color: color }}>{t('explorer:clubsComment')}</AppTextBody4>
            ),
            lazy: true,
            lazyPlaceholder: () => (
              <View style={styles.loaderContainer}>
                <AppActivityIndicator animating />
              </View>
            ),
          }}
          name={t('explorer:clubsComment')}
          component={clubsCommentScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    profileBody: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '90%',
    },
  });
