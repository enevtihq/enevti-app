import React from 'react';
import AppPortraitOverlayBox from 'enevti-app/components/molecules/list/AppPortraitOverlayBox';
import { StyleProp, ViewStyle } from 'react-native';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';

interface AppMomentItemProps {
  title: string;
  url: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function AppMomentItem({ title, url, style, onPress }: AppMomentItemProps) {
  return (
    <AppPortraitOverlayBox title={title} style={style} onPress={onPress} background={<AppNetworkImage url={url} />} />
  );
}
