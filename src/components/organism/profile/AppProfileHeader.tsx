import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppAvatarRenderer from '../../molecules/avatar/AppAvatarRenderer';
import { hp, wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Persona } from '../../../types/service/enevti/persona';
import AppTextHeading2 from '../../atoms/text/AppTextHeading2';
import AppTextBody3 from '../../atoms/text/AppTextBody3';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import Color from 'color';
import { useTheme } from '@react-navigation/native';
import { Theme } from '../../../theme/default';
import AppTertiaryButton from '../../atoms/button/AppTertiaryButton';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import AppMenuItem from '../../atoms/menu/AppMenuItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation';
import { HEADER_HEIGHT_PERCENTAGE } from '../../atoms/view/AppHeader';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';
import { Profile } from '../../../types/service/enevti/profile';
import { numberKMB, parseAmount } from '../../../utils/format/amount';
import { menuItemHeigtPercentage } from '../../../utils/layout/menuItemHeigtPercentage';

interface AppProfileHeaderProps {
  navigation: StackNavigationProp<RootStackParamList>;
  persona: Persona;
  profile: Profile;
}

export const PROFILE_HEADER_HEIGHT_PERCENTAGE = 42;

export default function AppProfileHeader({
  navigation,
  persona,
  profile,
}: AppProfileHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  return (
    <View pointerEvents={'box-none'} style={styles.profileHeaderContainer}>
      <AppAvatarRenderer
        address={persona.address}
        photo={persona.photo}
        size={wp('25%', insets)}
        style={{ marginBottom: hp('2%', insets) }}
      />

      <View style={{ height: hp('3.3%', insets) }}>
        {persona.username ? (
          <AppTextHeading2 numberOfLines={1}>
            {persona.username}
          </AppTextHeading2>
        ) : persona.address ? (
          <AppTextBody3
            style={{
              width: wp('50%', insets),
            }}
            numberOfLines={1}>
            {persona.address}
          </AppTextBody3>
        ) : (
          <AppTextBody3>?????</AppTextBody3>
        )}
      </View>

      <View style={styles.profileStatsContainer}>
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>{numberKMB(profile.nftSold, 2)}</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            {t('profile:nftSold')}
          </AppTextBody4>
        </View>
        <View style={styles.profileStatsDivider} />
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>{profile.treasuryAct}</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            {t('profile:treasuryAct')}
          </AppTextBody4>
        </View>
        <View style={styles.profileStatsDivider} />
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>
            {(profile.serveRate * 100).toFixed(2)}%
          </AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            {t('profile:serveRate')}
          </AppTextBody4>
        </View>
      </View>

      <View style={styles.profileActionContainer}>
        <AppTertiaryButton
          style={styles.profileActionButton}
          icon={iconMap.pool}
          onPress={() =>
            navigation.navigate('StakePool', { address: persona.address })
          }>
          {t('profile:stakeAndInsight') + '  '}
          <AppTextBody5
            style={{
              color: Color(theme.colors.text).darken(0.1).rgb().toString(),
            }}>
            {parseAmount(profile.stake, true, 2)} {getCoinName()}
          </AppTextBody5>
        </AppTertiaryButton>
        <AppMenuContainer
          tapEverywhereToDismiss
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          snapPoints={[`${menuItemHeigtPercentage(2)}%`]}
          anchor={
            <AppQuaternaryButton
              box
              icon={iconMap.menu}
              iconSize={hp('2%', insets)}
              style={styles.profileActionMoreButton}
              contentStyle={styles.profileActionMoreButtonContent}
              onPress={() => setMenuVisible(true)}
            />
          }>
          <AppMenuItem onPress={() => {}} title={t('home:follow')} />
          <AppMenuItem onPress={() => {}} title={t('profile:copyAddress')} />
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
              {parseAmount(profile.balance, true, 2)}
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
