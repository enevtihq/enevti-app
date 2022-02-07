import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppTextHeading3 from '../../components/atoms/text/AppTextHeading3';
import { hp, wp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

export default function Feed({}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle();

  return (
    <AppView darken={true}>
      <View style={{ height: 72 }} />
      <View style={styles.textContainer}>
        <View
          style={{
            paddingHorizontal: wp('5%', insets),
            marginBottom: hp('2%', insets),
          }}>
          <AppTextHeading3>Whats Happening</AppTextHeading3>
        </View>
        <View style={{ paddingHorizontal: wp('5%', insets) }}>
          <View
            style={{
              width: wp('25%', insets),
              height: wp('25%', insets) * 1.78,
              borderRadius: theme.roundness,
              overflow: 'hidden',
            }}>
            <FastImage
              style={{ height: '100%' }}
              source={{
                uri: 'https://unsplash.it/400/400?image=1',
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.overlay} />
            <AppTextBody4 style={styles.textOverlay}>@aldhosutra</AppTextBody4>
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
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    textOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });
