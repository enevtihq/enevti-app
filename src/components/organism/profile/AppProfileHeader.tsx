import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import Color from 'color';
import { useTheme } from '@react-navigation/native';
import { Theme } from 'enevti-app/theme/default';
import AppTertiaryButton from 'enevti-app/components/atoms/button/AppTertiaryButton';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppMenuItem from 'enevti-app/components/atoms/menu/AppMenuItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import { Profile } from 'enevti-app/types/core/account/profile';
import { numberKMB, parseAmount } from 'enevti-app/utils/format/amount';
import { menuItemHeigtPercentage } from 'enevti-app/utils/layout/menuItemHeigtPercentage';
import AppPersonaLabel from 'enevti-app/components/molecules/avatar/AppPersonaLabel';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppSecondaryButton from 'enevti-app/components/atoms/button/AppSecondaryButton';
import Clipboard from '@react-native-clipboard/clipboard';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import AppConfirmationModal from 'enevti-app/components/organism/menu/AppConfirmationModal';
import AppAlertModal from '../menu/AppAlertModal';
import { payManualDeliverSecret } from 'enevti-app/store/middleware/thunk/payment/creator/payDeliverSecret';

interface AppProfileHeaderProps {
  navigation: StackNavigationProp<RootStackParamList>;
  persona: Persona;
  profile: Profile;
}

export const PROFILE_HEADER_HEIGHT_PERCENTAGE = 42;

export default function AppProfileHeader({ navigation, persona, profile }: AppProfileHeaderProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const myPersona = useSelector(selectMyPersonaCache);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [pendingConfirmationVisible, setPendingConfirmationVisible] = React.useState<boolean>(false);
  const [pendingAlertVisible, setPendingAlertVisible] = React.useState<boolean>(false);
  const [viewerPendingAlertVisible, setViewerPendingAlertVisible] = React.useState<boolean>(false);

  const onPendingButtonPressed = React.useCallback(() => {
    profile.pending > 0
      ? persona.address === myPersona.address
        ? setPendingConfirmationVisible(old => !old)
        : setViewerPendingAlertVisible(old => !old)
      : setPendingAlertVisible(old => !old);
  }, [profile.pending, myPersona.address, persona.address]);

  const onPendingConfrimationDismiss = React.useCallback(() => {
    setPendingConfirmationVisible(false);
  }, []);

  const onPendingAlertDismiss = React.useCallback(() => {
    setPendingAlertVisible(false);
  }, []);

  const onViewerPendingAlertDismiss = React.useCallback(() => {
    setViewerPendingAlertVisible(false);
  }, []);

  const onManualSecretDelivery = React.useCallback(() => {
    dispatch(payManualDeliverSecret());
    onPendingConfrimationDismiss();
  }, [dispatch, onPendingConfrimationDismiss]);

  return (
    <View pointerEvents={'box-none'} style={styles.profileHeaderContainer}>
      <AppAvatarRenderer persona={persona} size={wp('25%', insets)} style={{ marginBottom: hp('2%', insets) }} />

      <View style={{ height: hp('3.3%', insets) }}>
        <AppPersonaLabel
          persona={persona}
          usernameComponent={AppTextHeading2}
          base32Component={AppTextBody3}
          base32Style={{
            width: wp('50%', insets),
          }}
        />
      </View>

      <View style={styles.profileStatsContainer}>
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>{numberKMB(profile.nftSold, 2)}</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{t('profile:nftSold')}</AppTextBody4>
        </View>
        <View style={styles.profileStatsDivider} />
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>{profile.treasuryAct}</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{t('profile:treasuryAct')}</AppTextBody4>
        </View>
        <View style={styles.profileStatsDivider} />
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>{(profile.serveRate * 100).toFixed(2)}%</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{t('profile:serveRate')}</AppTextBody4>
        </View>
      </View>

      <View style={styles.profileActionContainer}>
        {persona.username ? (
          <AppTertiaryButton
            style={styles.profileActionButton}
            icon={iconMap.pool}
            onPress={() =>
              navigation.navigate('StakePool', {
                arg: persona.address,
                mode: 'a',
              })
            }>
            {t('profile:stakeAndInsight') + '  '}
            <AppTextBody5
              style={{
                color: Color(theme.colors.text).darken(0.1).rgb().toString(),
              }}>
              {parseAmount(profile.stake, true, 2)} {getCoinName()}
            </AppTextBody5>
          </AppTertiaryButton>
        ) : persona.address === myPersona.address ? (
          <AppSecondaryButton
            style={styles.profileActionButton}
            icon={iconMap.setupPool}
            onPress={() => navigation.navigate('SetupUsername')}>
            {t('profile:setupStake')}
          </AppSecondaryButton>
        ) : (
          <AppTertiaryButton disabled style={styles.profileActionButton} icon={iconMap.poolNotReady}>
            {t('profile:stakeNotReady')}
          </AppTertiaryButton>
        )}
        <AppMenuContainer
          tapEverywhereToDismiss
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          snapPoints={[`${menuItemHeigtPercentage(3)}%`]}
          anchor={
            <AppQuaternaryButton
              box
              icon={iconMap.menu}
              iconSize={hp('2%', insets)}
              style={styles.profileActionMoreButton}
              iconStyle={styles.profileActionMoreButtonContent}
              onPress={() => setMenuVisible(true)}
            />
          }>
          <AppMenuItem onPress={() => {}} title={t('home:follow')} />
          <AppMenuItem
            onPress={() => {
              Clipboard.setString(persona.base32);
              dispatch(showSnackbar({ mode: 'info', text: t('profile:addressCopied') }));
              setMenuVisible(false);
            }}
            title={t('profile:copyAddress')}
          />
          <AppMenuItem
            onPress={() => {
              Clipboard.setString(persona.address);
              dispatch(showSnackbar({ mode: 'info', text: t('profile:addressCopied') }));
              setMenuVisible(false);
            }}
            title={t('profile:copyChainAddress')}
          />
        </AppMenuContainer>
      </View>

      <View style={styles.profileHeaderChipsContainer}>
        {profile.social.twitter.link && profile.social.twitter.stat ? (
          <AppQuaternaryButton
            icon={iconMap.twitter}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(profile.social.twitter.stat, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
        ) : null}
        <AppQuaternaryButton
          icon={iconMap.wallet}
          iconSize={hp('3%', insets)}
          iconColor={theme.colors.placeholder}
          style={{
            height: hp('4%', insets),
          }}
          onPress={() => console.log('Pressed')}>
          <View style={styles.profileHeaderChipsContent}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {parseAmount(profile.balance, true, 4)}
            </AppTextBody4>
            <AppTextBody5
              style={{
                color: theme.colors.placeholder,
                marginLeft: wp('1%', insets),
              }}>
              {getCoinName()}
            </AppTextBody5>
          </View>
        </AppQuaternaryButton>
        {profile.pending !== 0 ? (
          <AppQuaternaryButton
            icon={iconMap.pendingNFT}
            loaderLeft={profile.pending === -1}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={onPendingButtonPressed}>
            <View style={styles.profileHeaderChipsContent}>
              <AppTextBody4 style={{ color: theme.colors.placeholder }}>
                {profile.pending > 0 ? profile.pending : ''}
              </AppTextBody4>
              <AppTextBody5
                style={{
                  color: theme.colors.placeholder,
                  marginLeft: wp('1%', insets),
                }}>
                {profile.pending > 0 ? t('profile:pending') : t('profile:delivering')}
              </AppTextBody5>
            </View>
          </AppQuaternaryButton>
        ) : null}
        {profile.pending !== 0 ? (
          profile.pending > 0 ? (
            persona.address === myPersona.address ? (
              <AppConfirmationModal
                iconName={'pendingNFT'}
                visible={pendingConfirmationVisible}
                onDismiss={onPendingConfrimationDismiss}
                title={t('profile:pendingConfirmationTitle')}
                description={t('profile:pendingConfirmationDescription')}
                cancelText={t('profile:pendingConfirmationCancelText')}
                cancelOnPress={onPendingConfrimationDismiss}
                okText={t('profile:pendingConfirmationOkText')}
                okOnPress={onManualSecretDelivery}
              />
            ) : (
              <AppAlertModal
                visible={viewerPendingAlertVisible}
                iconName={'think'}
                onDismiss={onViewerPendingAlertDismiss}
                title={t('profile:pendingForViewerTitle')}
                description={t('profile:pendingForViewerDescription')}
                secondaryButtonText={t('profile:pendingForViewerButton')}
                secondaryButtonOnPress={onViewerPendingAlertDismiss}
              />
            )
          ) : profile.pending === -1 ? (
            <AppAlertModal
              visible={pendingAlertVisible}
              iconName={'deliveringSecret'}
              onDismiss={onPendingAlertDismiss}
              title={t('profile:pendingAlertTitle')}
              description={t('profile:pendingAlertDescription')}
              secondaryButtonText={t('profile:pendingAlertButton')}
              secondaryButtonOnPress={onPendingAlertDismiss}
            />
          ) : null
        ) : null}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
    },
    safeBackgroundBar: {
      position: 'absolute',
      top: -hp(HEADER_HEIGHT_PERCENTAGE, insets),
      width: wp('100%', insets),
      height: hp(HEADER_HEIGHT_PERCENTAGE, insets),
      backgroundColor: theme.colors.background,
    },
    profileHeaderContainer: {
      alignItems: 'center',
      paddingVertical: hp('1%', insets),
      height: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets),
      width: wp('100%', insets),
      backgroundColor: theme.colors.background,
    },
    profileStatsContainer: {
      flexDirection: 'row',
      width: wp('85%', insets),
      marginTop: hp('2%', insets),
      height: hp('5.2%', insets),
    },
    profileStatsItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileStatsDivider: {
      height: '50%',
      alignSelf: 'center',
      borderWidth: 0.3,
      borderColor: Color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
    },
    profileActionContainer: {
      marginTop: hp('2%', insets),
      flexDirection: 'row',
    },
    profileActionButton: {
      height: hp('6%', insets),
      marginRight: wp('2%', insets),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileActionMoreButton: {
      height: hp('6%', insets),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileActionMoreButtonContent: {
      paddingRight: 0,
    },
    profileHeaderChipsContainer: {
      height: hp('3%', insets),
      marginVertical: hp('3%', insets),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileHeaderChipsContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
