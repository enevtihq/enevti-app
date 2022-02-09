import { View, StyleSheet } from 'react-native';
import React from 'react';
import DropShadow from 'react-native-drop-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import { Theme } from '../../theme/default';
import AppNetworkImage from '../atoms/image/AppNetworkImage';
import AppTextHeading3 from '../atoms/text/AppTextHeading3';
import AppTextBody5 from '../atoms/text/AppTextBody5';
import AppIconButton from '../atoms/icon/AppIconButton';
import { iconMap } from '../atoms/icon/AppIconComponent';
import color from 'color';

const profileURL =
  'https://res.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7,q_auto:eco,dpr_1/jtwy0wk2w1f4wzjkpvyx';

export default function AppFeedItem() {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets, theme);

  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setCanvasWidth(e.nativeEvent.layout.width);
  }, []);

  const FeedHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerAvatarContainer}>
        <View style={styles.headerAvatar}>
          <AppNetworkImage style={styles.avatar} url={profileURL} />
        </View>
      </View>
      <View style={styles.headerAvatarInfoContainer}>
        <AppTextHeading3 numberOfLines={1}>aldhosutra</AppTextHeading3>
        <AppTextBody5 numberOfLines={1}>Promoted By Community</AppTextBody5>
      </View>
      <View style={styles.headerPoolContainer}>
        <View style={styles.headerPoolButton}>
          <TouchableRipple
            style={styles.headerPoolButtonTouchable}
            onPress={() => console.log('anjay')}>
            <View>
              <AppTextHeading3 style={styles.headerPoolText}>
                121M
              </AppTextHeading3>
              <AppTextBody5 style={styles.headerPoolText}>$ENVT</AppTextBody5>
            </View>
          </TouchableRipple>
        </View>
      </View>
      <View style={styles.headerMoreButtonContainer}>
        <AppIconButton
          icon={iconMap.dots}
          size={20}
          style={styles.headerMoreButton}
          onPress={() => console.log('more')}
        />
      </View>
    </View>
  );

  return (
    <DropShadow style={styles.shadowProp}>
      <View style={styles.card}>
        <FeedHeader />
        <View
          onLayout={onLayout}
          style={{ width: '100%', aspectRatio: 1, backgroundColor: 'red' }}
        />
      </View>
    </DropShadow>
  );
}

const makeStyle = (insets: SafeAreaInsets, theme: Theme) =>
  StyleSheet.create({
    shadowProp: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.dark ? 0.1 : 0.03,
      shadowRadius: 4,
    },
    card: {
      margin: wp('5%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
    },
    headerAvatarContainer: {
      justifyContent: 'center',
    },
    headerAvatar: {
      width: wp('10%', insets),
      aspectRatio: 1,
      borderRadius: wp('5%', insets),
      overflow: 'hidden',
    },
    headerAvatarInfoContainer: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: wp('2%', insets),
    },
    headerPoolContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp('2%', insets),
    },
    headerPoolText: {
      textAlign: 'center',
    },
    headerPoolButton: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: color(theme.colors.text).alpha(0.2).rgb().toString(),
      borderRadius: theme.roundness,
      width: '100%',
      alignItems: 'center',
      overflow: 'hidden',
    },
    headerPoolButtonTouchable: {
      width: '100%',
      alignItems: 'center',
    },
    headerMoreButtonContainer: {
      justifyContent: 'center',
      width: wp('8%', insets),
    },
    headerMoreButton: {
      width: wp('6%', insets),
    },
    avatar: {
      width: '100%',
      aspectRatio: 1,
    },
  });
