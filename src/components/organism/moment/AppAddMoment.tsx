import React from 'react';
import AppPortraitOverlayBox from 'enevti-app/components/molecules/list/AppPortraitOverlayBox';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import { StyleSheet, View } from 'react-native';
import AppBadge from 'enevti-app/components/atoms/view/AppBadge';
import { useTranslation } from 'react-i18next';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { setMomentAlertShow } from 'enevti-app/store/slices/ui/view/moment';

interface AppAddMomentProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppAddMoment({ navigation }: AppAddMomentProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const myPersonaCache = useSelector(selectMyPersonaCache);
  const myProfileCache = useSelector(selectMyProfileCache);
  const isEligibile = React.useMemo(() => myProfileCache.momentSlot > 0, [myProfileCache.momentSlot]);
  const primary = isEligibile ? theme.colors.primary : Color(theme.colors.text).alpha(0.4).rgb().string();
  const secondary = isEligibile ? theme.colors.secondary : Color(theme.colors.text).alpha(0.4).rgb().string();

  const onAddMomentPress = React.useCallback(() => {
    if (isEligibile) {
      navigation.navigate('ChooseNFTforMoment');
    } else {
      dispatch(setMomentAlertShow(true));
    }
  }, [dispatch, isEligibile, navigation]);

  return (
    <LinearGradient colors={[primary, secondary]} style={styles.gradientBox}>
      <AppPortraitOverlayBox
        title={t('home:addMoment')}
        style={styles.box}
        onPress={onAddMomentPress}
        foreground={
          <View style={styles.foreground}>
            <View>
              <AppAvatarRenderer persona={myPersonaCache} size={hp(6)} />
              <AppBadge
                content={myProfileCache.momentSlot > 0 ? myProfileCache.momentSlot.toString() : t('home:noSlot')}
              />
            </View>
          </View>
        }
        background={
          <View style={styles.backgroundContainer}>
            <AppAvatarRenderer full persona={myPersonaCache} size={hp(6)} style={styles.background} />
          </View>
        }
      />
    </LinearGradient>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    box: {
      width: wp('25%', insets) - 4,
      height: wp('25%', insets) * 1.78 - 4,
    },
    gradientBox: {
      marginRight: wp('2%', insets),
      marginLeft: wp('5%', insets),
      borderRadius: theme.roundness,
      padding: 3,
    },
    foreground: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      borderColor: theme.colors.background,
      borderWidth: 1,
      borderRadius: theme.roundness,
    },
    background: {
      opacity: 0.25,
      alignSelf: 'center',
      height: '100%',
    },
    backgroundContainer: {
      backgroundColor: 'black',
    },
  });
