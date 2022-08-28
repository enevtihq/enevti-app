import { View, Text } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Socket } from 'socket.io-client';
import { videoCallSocket } from 'enevti-app/utils/network';
import { getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { createSignature } from 'enevti-app/utils/cryptography';

type Props = StackScreenProps<RootStackParamList, 'RedeemVideoCall'>;

export default function RedeemVideoCall({ navigation, route }: Props) {
  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    const run = async () => {
      const publicKey = await getMyPublicKey();
      const signature = await createSignature(route.params.nft.id);
      socket.current = videoCallSocket({ nftId: route.params.nft.id, publicKey, signature });
    };

    run();

    return function cleanup() {
      socket.current?.disconnect();
    };
  }, [route.params.nft.id]);
  return (
    <View style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>RedeemVideoCall</Text>
    </View>
  );
}
