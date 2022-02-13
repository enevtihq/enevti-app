import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppNetworkImage from '../../atoms/image/AppNetworkImage';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const profileURL =
  'https://res.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7,q_auto:eco,dpr_1/jtwy0wk2w1f4wzjkpvyx';

export default function AppFeedHeader() {
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  return (
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
        <AppQuaternaryButton
          box
          style={styles.stakeButton}
          onPress={() => console.log('stake')}>
          <View style={styles.stakeButtonContainer}>
            <AppTextHeading3 style={styles.headerPoolText}>
              121M
            </AppTextHeading3>
            <AppTextBody5 style={styles.headerPoolText}>$ENVT</AppTextBody5>
          </View>
        </AppQuaternaryButton>
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
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
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
      paddingVertical: '1%',
    },
    headerPoolText: {
      textAlign: 'center',
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
    stakeButton: {
      height: '100%',
      width: '100%',
    },
    stakeButtonContainer: {
      width: '100%',
    },
  });
