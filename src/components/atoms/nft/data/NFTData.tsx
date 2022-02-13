import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../../../types/nft';
import NFTImageData from './contentType/NFTImageData';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';

interface NFTDataProps {
  nft: NFT;
  args: TemplateArgs;
  box?: boolean;
}

const handleRenderNFTData = (nftObject: NFT) => {
  switch (nftObject.contentType) {
    case 'image':
      return <NFTImageData nft={nftObject} />;
    default:
      return <View />;
  }
};

export default function NFTData({ nft, args, box = false }: NFTDataProps) {
  const styles = makeStyle(box, args);

  return (
    <View style={styles.nftDataContainer}>
      <View style={styles.nftDataBox}>{handleRenderNFTData(nft)}</View>
    </View>
  );
}

const makeStyle = (box: boolean, args: TemplateArgs) =>
  StyleSheet.create({
    nftDataContainer: {
      position: 'absolute',
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      transform: [{ rotate: args.rotate }],
    },
    nftDataBox: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      padding: box ? '1%' : '0%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
