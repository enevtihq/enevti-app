import { View, Text } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { Socket } from 'socket.io-client';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';

interface AppRedeemVideoCallProps {
  route: RouteProp<RootStackParamList, 'RedeemVideoCall'>;
}

export default function AppRedeemVideoCall({ route }: AppRedeemVideoCallProps) {
  const insets = useSafeAreaInsets();
  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    // const run = async () => {
    //   const publicKey = await getMyPublicKey();
    //   const signature = await createSignature(route.params.nft.id);
    //   socket.current = videoCallSocket({ nftId: route.params.nft.id, publicKey, signature });
    // };
    // run();
    // return function cleanup() {
    //   socket.current?.disconnect();
    // };
  }, [route.params.nft.id]);

  return (
    <View style={{ flex: 1 }}>
      <AppMenuContainer
        transparentBackdrop
        enablePanDownToClose={false}
        visible={true}
        snapPoints={['18%', '35%']}
        onDismiss={() => {}}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: hp(2) }}>
          <AppIconButton icon={iconMap.add} size={hp(5)} style={{ marginHorizontal: wp(5) }} />
          <AppIconButton icon={iconMap.add} size={hp(5)} style={{ marginHorizontal: wp(5) }} />
          <AppIconButton icon={iconMap.add} size={hp(5)} style={{ marginHorizontal: wp(5) }} />
          <AppIconButton icon={iconMap.add} size={hp(5)} style={{ marginHorizontal: wp(5) }} />
        </View>
      </AppMenuContainer>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: hp(30) + insets.top,
          backgroundColor: 'black',
        }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          <AppAvatarRenderer size={hp(16)} />
          <AppTextBody3 style={{ marginTop: hp(1) }}>Authorizing</AppTextBody3>
        </View>
      </View>
    </View>
  );
}
