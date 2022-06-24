import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppQRCode from 'enevti-app/components/atoms/qr/AppQRCode';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTertiaryButton from 'enevti-app/components/atoms/button/AppTertiaryButton';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';

type Props = StackScreenProps<RootStackParamList, 'ReceiveToken'>;

export default function ReceiveToken({ navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const myPersona = useSelector(selectMyPersonaCache);

  return (
    <AppView darken>
      <AppHeaderWizard
        back
        backIcon={iconMap.close}
        navigation={navigation}
        title={t('wallet:receiveToken')}
        description={t('wallet:receiveTokenDescription')}
        style={styles.header}
      />

      <AppListItem
        containerStyle={styles.accountCard}
        leftContent={
          <View style={styles.collectionCoverContainer}>
            <AppAvatarRenderer persona={myPersona} size={wp('12%', insets)} style={styles.avatar} />
          </View>
        }
        rightContent={<AppIconButton size={20} icon={iconMap.copy} onPress={() => {}} style={styles.avatar} />}>
        <AppTextHeading3 numberOfLines={1}>{parsePersonaLabel(myPersona)}</AppTextHeading3>
        {myPersona.username ? (
          <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
            {myPersona.base32}
          </AppTextBody4>
        ) : null}
      </AppListItem>

      <View style={styles.qrContainer}>
        <AppQRCode value={'value'} size={hp(25)} />
        <View style={{ height: hp(3) }} />
        <AppQuaternaryButton
          icon={iconMap.copy}
          iconSize={hp('3%', insets)}
          iconColor={theme.colors.placeholder}
          style={{
            height: hp('4%', insets),
          }}
          onPress={() => {}}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{t('wallet:copyQrValue')}</AppTextBody4>
        </AppQuaternaryButton>
      </View>

      <View>
        <AppTertiaryButton style={styles.shareButton}>Share</AppTertiaryButton>
      </View>
    </AppView>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    avatar: {
      alignSelf: 'center',
    },
    accountCard: {
      marginVertical: hp('3%', insets),
      marginHorizontal: wp('10%', insets),
    },
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    qrContainer: {
      flex: 1,
      alignItems: 'center',
    },
    shareButton: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    collectionCoverContainer: {
      marginRight: wp('3%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
  });
