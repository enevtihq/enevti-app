import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import UtilityBackground from './UtilityBackground';
import { NFTTemplateItem } from '../../../types/nft/template';
import NFTData from './NFTData';

const nft: NFT = {
  data: 'Qmb3jKA6Vn1azR6aSMnT6geGMkg818uBkfSHNg8ui1a9dy',
  contentType: 'image',
  utility: 'videocall',
  template: [
    { type: 'utility-background' },
    {
      type: 'data-box',
      args: { x: '15%', y: '15%', width: '70%', height: '70%' },
    },
  ],
};

const handleRenderNFTTemplate = (
  templateItem: NFTTemplateItem,
  nftObject: NFT,
  canvasWidth: number,
  index: number,
) => {
  switch (templateItem.type) {
    case 'utility-background':
      return (
        <UtilityBackground key={index} nft={nftObject} width={canvasWidth} />
      );
    case 'data':
      return <NFTData key={index} nft={nftObject} args={templateItem.args} />;
    case 'data-box':
      return (
        <NFTData box key={index} nft={nftObject} args={templateItem.args} />
      );
    default:
      return <View key={index} />;
  }
};

export default function NFTRenderer() {
  const styles = makeStyle();

  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setCanvasWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View onLayout={onLayout} style={styles.nftContainer}>
      {nft.template.map((templateItem, index) =>
        handleRenderNFTTemplate(templateItem, nft, canvasWidth, index),
      )}
    </View>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    nftContainer: {
      width: '100%',
      aspectRatio: 1,
    },
  });
