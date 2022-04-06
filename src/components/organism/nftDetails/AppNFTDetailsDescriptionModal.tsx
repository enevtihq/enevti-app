import { View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { wp, hp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NFT } from 'enevti-app/types/nft';

interface AppNFTDetailsDescriptionModalProps {
  nft: NFT;
  visible: boolean;
  onDismiss: () => void;
}

export default function AppNFTDetailsDescriptionModal({
  nft,
  visible,
  onDismiss,
}: AppNFTDetailsDescriptionModalProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const snapPoints = React.useMemo(() => ['75%'], []);
  return (
    <AppMenuContainer
      tapEverywhereToDismiss
      enablePanDownToClose
      snapPoints={snapPoints}
      visible={visible}
      onDismiss={onDismiss}>
      <View
        style={{
          paddingVertical: wp('2%', insets),
          paddingHorizontal: wp('5%', insets),
        }}>
        <AppTextHeading2>
          {nft.symbol}#{nft.serial}{' '}
          <AppTextBody3 style={{ color: theme.colors.placeholder }}>
            ({nft.name})
          </AppTextBody3>
        </AppTextHeading2>

        <AppTextBody4 style={{ marginTop: hp('2%', insets) }}>
          {nft.description}
        </AppTextBody4>
      </View>
    </AppMenuContainer>
  );
}
