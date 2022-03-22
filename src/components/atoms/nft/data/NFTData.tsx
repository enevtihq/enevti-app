import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import NFTImageData from './contentType/NFTImageData';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import mimeMapping from '../../../../utils/mime/mimeMapping';

interface NFTDataProps {
  nft: NFTBase;
  args: TemplateArgs;
  box?: boolean;
  dataUri?: string;
}

const handleRenderNFTData = (nftObject: NFTBase, dataUri?: string) => {
  switch (mimeMapping(nftObject.dataMime)) {
    case 'image':
      return <NFTImageData nft={nftObject} dataUri={dataUri} />;
    default:
      return <View />;
  }
};

export default function NFTData({
  nft,
  args,
  box = false,
  dataUri,
}: NFTDataProps) {
  const styles = React.useMemo(() => makeStyles(box, args), [box, args]);

  return (
    <View style={styles.nftDataContainer}>
      {handleRenderNFTData(nft, dataUri)}
    </View>
  );
}

const makeStyles = (box: boolean, args: TemplateArgs) =>
  StyleSheet.create({
    nftDataContainer: {
      position: 'absolute',
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      transform: [{ rotate: args.rotate }],
      backgroundColor: 'white',
      padding: box ? '1%' : '0%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
