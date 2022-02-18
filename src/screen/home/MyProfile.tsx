import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppAvatarRenderer from '../../components/molecules/avatar/AppAvatarRenderer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/state';
import { selectPersona } from '../../store/slices/entities/persona';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../../utils/imageRatio';
import AppTextHeading2 from '../../components/atoms/text/AppTextHeading2';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import { iconMap } from '../../components/atoms/icon/AppIconComponent';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';
import AppTextBody5 from '../../components/atoms/text/AppTextBody5';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../theme/default';
import color from 'color';
import AppTertiaryButton from '../../components/atoms/button/AppTertiaryButton';
import AppQuaternaryButton from '../../components/atoms/button/AppQuaternaryButton';
import AppTextHeading3 from '../../components/atoms/text/AppTextHeading3';
import AppMenuContainer from '../../components/atoms/menu/AppMenuContainer';
import AppMenuItem from '../../components/atoms/menu/AppMenuItem';

type Props = StackScreenProps<RootStackParamList, 'MyProfile'>;

interface MyProfileProps extends Props {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight?: number;
}

export default function MyProfile({ headerHeight }: MyProfileProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle();
  const myPersona = useSelector((state: RootState) => selectPersona(state));

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  return (
    <AppView edges={['left', 'right', 'bottom']}>
      <View style={{ height: headerHeight }} />
      <View style={styles.textContainer}>
        <View
          style={{ alignItems: 'center', marginVertical: hp('1%', insets) }}>
          <AppAvatarRenderer
            address={myPersona.address}
            photo={myPersona.photo}
            size={wp('25%', insets)}
            style={{ marginBottom: hp('1%', insets) }}
          />

          {myPersona.username ? (
            <AppTextHeading2 numberOfLines={1}>
              {myPersona.username}
            </AppTextHeading2>
          ) : myPersona.address ? (
            <AppTextBody3
              style={{
                width: wp('50%', insets),
              }}
              numberOfLines={1}>
              {myPersona.address}
            </AppTextBody3>
          ) : (
            <View />
          )}

          <View
            style={{
              flexDirection: 'row',
              width: wp('85%', insets),
              marginTop: hp('2%', insets),
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AppTextHeading3>1.5K</AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }}>
                NFT Sold
              </AppTextBody4>
            </View>
            <View
              style={{
                height: '50%',
                alignSelf: 'center',
                borderWidth: 0.3,
                borderColor: color(theme.colors.placeholder)
                  .alpha(0.1)
                  .rgb()
                  .toString(),
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AppTextHeading3>54</AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }}>
                Treasury Act
              </AppTextBody4>
            </View>
            <View
              style={{
                height: '50%',
                alignSelf: 'center',
                borderWidth: 0.3,
                borderColor: color(theme.colors.placeholder)
                  .alpha(0.1)
                  .rgb()
                  .toString(),
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AppTextHeading3>98%</AppTextHeading3>
              <AppTextBody4 style={{ color: theme.colors.placeholder }}>
                Serve Rate
              </AppTextBody4>
            </View>
          </View>

          <View style={{ marginTop: hp('2%', insets), flexDirection: 'row' }}>
            <AppTertiaryButton
              style={{
                height: hp('6%', insets),
                marginRight: wp('2%', insets),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={iconMap.pool}
              onPress={() => {}}>
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
                  style={{
                    height: hp('6%', insets),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  contentStyle={{
                    paddingRight: 0,
                  }}
                  onPress={() => setMenuVisible(true)}
                />
              }>
              <AppMenuItem onPress={() => {}} title={'Follow'} />
              <AppMenuItem onPress={() => {}} title={'Copy Address'} />
            </AppMenuContainer>
          </View>

          <View
            style={{
              height: hp('3%', insets),
              marginTop: hp('3%', insets),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
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
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
  });
