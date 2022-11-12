import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import NFTImageData from './contentType/NFTImageData';
import { TemplateArgs } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import mimeMapping from 'enevti-app/utils/mime/mimeMapping';
import { SizeCode } from 'enevti-app/types/core/service/api';

interface NFTDataProps {
  nft: NFTBase;
  args: TemplateArgs;
  imageSize: SizeCode;
  box?: boolean;
  dataUri?: string;
  blurRadius?: number;
  realRatio?: boolean;
  width?: number;
  lazy?: boolean;
}

const handleRenderNFTData = (
  nftObject: NFTBase,
  size: SizeCode,
  width?: number,
  dataUri?: string,
  blurRadius?: number,
  realRatio?: boolean,
  isLazy?: boolean,
) => {
  switch (mimeMapping(nftObject.data.mime)) {
    case 'image':
      return (
        <NFTImageData
          lazy={isLazy}
          nft={nftObject}
          width={width}
          imageSize={size}
          dataUri={dataUri}
          blurRadius={blurRadius}
          realRatio={realRatio}
        />
      );
    default:
      return <View />;
  }
};

export default function NFTData({
  nft,
  args,
  width,
  box = false,
  dataUri,
  blurRadius,
  realRatio,
  imageSize,
  lazy,
}: NFTDataProps) {
  const styles = React.useMemo(() => makeStyles(box, args), [box, args]);

  return (
    <View style={styles.nftDataContainer}>
      {handleRenderNFTData(nft, imageSize, width, dataUri, blurRadius, realRatio, lazy)}
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
      backgroundColor: 'transparent',
      padding: box ? '1%' : '0%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
