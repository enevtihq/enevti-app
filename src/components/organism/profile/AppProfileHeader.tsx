import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppAvatarRenderer from '../../molecules/avatar/AppAvatarRenderer';
import { hp, wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonaBase } from '../../../types/service/enevti/persona';
import AppTextHeading2 from '../../atoms/text/AppTextHeading2';
import AppTextBody3 from '../../atoms/text/AppTextBody3';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import color from 'color';
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

interface AppProfileHeaderProps {
  navigation: StackNavigationProp<RootStackParamList>;
  persona: PersonaBase;
}

export const APP_PROFILE_HEIGHT_PERCENTAGE = 42;

export default function AppProfileHeader({
  navigation,
  persona,
}: AppProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme, insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  return (
    <View style={styles.profileHeaderContainer}>
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
          <AppTextBody3>???</AppTextBody3>
        )}
      </View>

      <View style={styles.profileStatsContainer}>
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>1.5K</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            NFT Sold
          </AppTextBody4>
        </View>
        <View style={styles.profileStatsDivider} />
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>54</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            Treasury Act
          </AppTextBody4>
        </View>
        <View style={styles.profileStatsDivider} />
        <View style={styles.profileStatsItem}>
          <AppTextHeading3>98%</AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            Serve Rate
          </AppTextBody4>
        </View>
      </View>

      <View style={styles.profileActionContainer}>
        <AppTertiaryButton
          style={styles.profileActionButton}
          icon={iconMap.pool}
          onPress={() =>
            navigation.navigate('StakePool', { persona: persona })
          }>
          Stake & Insight{'  '}
          <AppTextBody5
            style={{
              color: color(theme.colors.text).darken(0.1).rgb().toString(),
            }}>
            123.78K $ENVT
          </AppTextBody5>
        </AppTertiaryButton>
        <AppMenuContainer
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
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
          <AppMenuItem onPress={() => {}} title={'Follow'} />
          <AppMenuItem onPress={() => {}} title={'Copy Address'} />
        </AppMenuContainer>
      </View>

      <View style={styles.profileHeaderChipsContainer}>
        <AppQuaternaryButton
          icon={iconMap.twitter}
          iconSize={hp('3%', insets)}
          iconColor={theme.colors.placeholder}
          style={{
            marginHorizontal: wp('1%', insets),
            height: hp('4%', insets),
          }}
          onPress={() => console.log('Pressed')}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            1.12K
          </AppTextBody4>
        </AppQuaternaryButton>
        <AppQuaternaryButton
          icon={iconMap.wallet}
          iconSize={hp('3%', insets)}
          iconColor={theme.colors.placeholder}
          style={{
            marginHorizontal: wp('1%', insets),
            height: hp('4%', insets),
          }}
          onPress={() => console.log('Pressed')}>
          <View style={styles.profileHeaderChipsContent}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              892
            </AppTextBody4>
            <AppTextBody5
              style={{
                color: theme.colors.placeholder,
                marginLeft: wp('1%', insets),
              }}>
              $ENVT
            </AppTextBody5>
          </View>
        </AppQuaternaryButton>
      </View>
    </View>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    profileHeaderContainer: {
      alignItems: 'center',
      marginVertical: hp('1%', insets),
      height: hp(APP_PROFILE_HEIGHT_PERCENTAGE, insets),
      width: wp('100%', insets),
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
      borderColor: color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
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
