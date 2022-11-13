import React from 'react';
import AppPortraitOverlayBox from 'enevti-app/components/molecules/list/AppPortraitOverlayBox';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import { StyleSheet, View } from 'react-native';
import AppBadge from 'enevti-app/components/atoms/view/AppBadge';
import { useTranslation } from 'react-i18next';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';

export default function AppAddMoment() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const myPersonaCache = useSelector(selectMyPersonaCache);
  const myProfileCache = useSelector(selectMyProfileCache);

  return (
    <AppPortraitOverlayBox
      blurBackground
      title={t('home:addMoment')}
      style={styles.box}
      onPress={() => {}}
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
      background={<AppAvatarRenderer full persona={myPersonaCache} size={hp(6)} style={styles.background} />}
    />
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    box: { marginRight: wp('2%', insets), marginLeft: wp('5%', insets) },
    foreground: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    background: {
      alignSelf: 'center',
      height: '100%',
    },
  });
