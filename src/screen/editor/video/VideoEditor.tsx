/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { wp } from 'enevti-app/utils/layout/imageRatio';

type Props = StackScreenProps<RootStackParamList, 'VideoEditor'>;

export default function VideoEditor({ navigation }: Props) {
  return (
    <AppView
      edges={['bottom', 'left', 'right']}
      header={<AppHeader back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={' '} />}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppTextBody3 style={{ textAlign: 'center', margin: wp(10) }}>
          ERROR: This Component is only available for iOS!
        </AppTextBody3>
      </View>
    </AppView>
  );
}
